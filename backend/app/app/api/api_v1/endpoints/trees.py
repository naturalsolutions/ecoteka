import io
import logging
import os
import shutil
from typing import Any, List, Union
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Request, Body
from sqlalchemy.orm import Session
from starlette.responses import FileResponse, HTMLResponse
from app import crud, models, schemas
from app.api import get_db
from app.core import set_policies, authorization, permissive_authorization, get_current_user, settings
from app.worker import import_geofile_task


from fastapi.responses import StreamingResponse
import geopandas as gpd
import imghdr
import requests

from fastapi_cache import FastAPICache


router = APIRouter()
policies = {
    "trees:get": ["owner", "manager", "contributor", "reader"],
    "trees:add": ["owner", "manager", "contributor"],
    "trees:update": ["owner", "manager", "contributor"],
    "trees:delete": ["owner", "manager", "contributor"],
    "trees:get_interventions": ["owner", "manager", "contributor", "reader"],
    "trees:import": ["owner", "manager", "contributor"],
    "trees:export": ["owner", "manager", "contributor"],
    "trees:bulk_delete": ["owner", "manager", "contributor"],
    "trees:upload_images": ["owner", "manager", "contributor"],
    "trees:get_images": ["owner", "manager", "contributor", "reader"],
    "trees:delete_images": ["owner", "manager", "contributor"],
    "trees:delete_image": ["owner", "manager", "contributor"],
}
set_policies(policies)

@router.post("/import", response_model=schemas.GeoFile)
def trees_import(
    *,
    auth=Depends(authorization("trees:import")),
    db: Session = Depends(get_db),
    name: str,
) -> Any:
    """
    import trees from geofile
    """
    geofile = crud.geo_file.get_by_name(db, name=name)

    if not geofile:
        raise HTTPException(status_code=404, detail=f"{name} not found")

    if not geofile.crs:
        raise HTTPException(status_code=415, detail="crs not found")

    if geofile.driver in ["xlsx", "xls", "csv"]:
        if not geofile.longitude_column:
            raise HTTPException(status_code=415, detail="longitude_column not found")

        if not geofile.latitude_column:
            raise HTTPException(status_code=415, detail="latitude_column not found")

    if geofile.status == models.GeoFileStatus.IMPORTING:
        raise HTTPException(
            status_code=409,
            detail=f"{geofile.name} has already started an import process",
        )

    import_geofile_task.delay(name)

    return geofile


@router.get("/export")
def trees_export(
    organization_id: int,
    format: str = "geojson",
    auth=Depends(authorization("trees:export")),
    db: Session = Depends(get_db),
) -> Any:
    sql = f"SELECT * FROM public.tree WHERE organization_id = {organization_id}"
    df = gpd.read_postgis(sql, db.bind)

    if df.empty:
        return HTTPException(status_code=404, detail="this organization has no trees")

    if format not in ["geojson", "csv", "xlsx"]:
        return HTTPException(status_code=404, detail="format not found")

    organization_in_db = crud.organization.get(db, id=organization_id)

    if organization_in_db is None:
        raise HTTPException(status_code=404, detail="organization not found")

    stream: Union[io.BytesIO, io.StringIO] = io.BytesIO()

    if format == "geojson":
        df.to_file(stream, driver="GeoJSON")
        media_type = "application/geo+json"

    if format in ["csv", "xlsx"]:
        df["lat"] = df.geom.y
        df["lng"] = df.geom.x
        df_properties = gpd.pd.DataFrame(df["properties"].values.tolist())
        col = df.columns.difference(["properties"])
        df = gpd.pd.concat([df[col], df_properties], axis=1)
        df = df.drop(columns=["geom"])

    if format == "csv":
        stream = io.StringIO(df.to_csv())
        media_type = "text/csv"

    if format == "xlsx":
        df.to_excel(stream, engine="xlsxwriter")
        media_type = "application/xlsx"

    response = StreamingResponse(iter([stream.getvalue()]), media_type=media_type)
    response.headers["Content-Disposition"] = f"attachment; filename=export.{format}"

    return response

@router.get("/metrics", dependencies=[Depends(permissive_authorization("trees:get"))], response_model=schemas.tree.Metrics)
async def get_metrics(
    organization_id: int,
    fields: str,
    db: Session = Depends(get_db)
) -> Any:
    """ Get Trees properties metrics"""
    backend = FastAPICache.get_backend()
    coder =  FastAPICache.get_coder()
    key = f'trees_metrics_{organization_id}_{fields}'
    ret = await backend.get(key)
        
    if ret is None:
        requested_fields = fields.split(",")
        ratio = crud.tree.get_properties_completion_ratio(db, organization_id, requested_fields)
        aggregates = crud.tree.get_properties_aggregates(db, organization_id, requested_fields)
        mostRepresented = [item for item in aggregates["canonicalName"] if item["value"] != " "][:6]

        for index, item in enumerate(mostRepresented):
            canonical_name = item["value"].replace(" x ", " ").replace("‹", "i")
            item["value"] = canonical_name
            response_eol_search = requests.get(f'https://eol.org/api/search/1.0.json?q={canonical_name}')
            if response_eol_search.status_code == 200 and len(response_eol_search.json()["results"]) > 0:
                id = response_eol_search.json()["results"][0]["id"]
                response_eol_pages = requests.get(f'https://eol.org/api/pages/1.0/{id}.json?details=true&images_per_page=10')
                if response_eol_pages.status_code == 200:
                    json = response_eol_pages.json()
                    if "dataObjects" in json["taxonConcept"] and len(json["taxonConcept"]["dataObjects"]) > 0:
                        mostRepresented[index]["thumbnail"] = json["taxonConcept"]["dataObjects"][0]["eolThumbnailURL"]
                    else:
                        response_wikispecies = requests.get(f'https://species.wikimedia.org/api/rest_v1/page/summary/{canonical_name.replace(" ", "_")}')
                        if response_wikispecies.status_code == 200 and "thumbnail" in response_wikispecies.json():
                            mostRepresented[index]["thumbnail"] = response_wikispecies.json()["thumbnail"]["source"]


        canonicalNameTotalCount = sum(item["total"] for item in aggregates["canonicalName"])
        metrics = schemas.tree.Metrics(
            canonicalNameTotalCount=canonicalNameTotalCount,
            mostRepresented=mostRepresented,
            ratio=ratio,
            aggregates=aggregates,
        )
        await backend.set(key, coder.encode(metrics), 60000000)
        return metrics
    
    return coder.decode(ret) 


@router.get("/{tree_id}", dependencies=[Depends(permissive_authorization("trees:get"))], response_model=schemas.tree.Tree_xy)
def get(
    tree_id: int,
    db: Session = Depends(get_db),
) -> Any:
    """Gets a tree"""
    tree = crud.tree.get(db, tree_id)

    if not tree:
        raise HTTPException(status_code=404, detail=f"{tree_id} not found")

    return tree.to_xy()


@router.post("", response_model=schemas.tree.Tree_xy)
async def add(
    organization_id: int,
    *,
    request: Request,
    auth=Depends(authorization("trees:add")),
    db: Session = Depends(get_db),
    tree: schemas.TreePost,
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """Add one tree"""
    try:
        tree_with_user_info = schemas.TreeCreate(
            geom=f"POINT({tree.x} {tree.y})",
            properties=tree.properties,
            user_id=current_user.id,
            organization_id=organization_id,
        )

        tree_in_db = crud.crud_tree.tree.create(db, obj_in=tree_with_user_info)
        
        return tree_in_db.to_xy()
    except Exception as error:
        return HTTPException(status_code=500, detail=error)




@router.put(
    "/{tree_id}", 
    response_model=schemas.tree.Tree_xy, 
    dependencies=[Depends(authorization("trees:update"))]
)
def update(
    tree_id: int,
    *,
    db: Session = Depends(get_db),
    payload: schemas.tree.TreeUpdate,
) -> Any:
    """Update one tree"""
    tree_in_db = crud.tree.get(db, id=tree_id)

    if tree_in_db is None:
        return HTTPException(status_code=404, detail=f"Tree {tree_id} not found")

    properties = {k: v for (k, v) in payload.properties.items() if v != ""}
    tree_in_db.properties = properties
    db.commit()
    return tree_in_db.to_xy()


@router.delete("/bulk_delete")
async def bulk_delete(
    organization_id: int,
    request: Request,
    trees: List[int] = Body(..., embed=True),
    db: Session = Depends(get_db),
    auth=Depends(authorization("trees:bulk_delete")),
) -> Any:
    """Bulk delete"""
    for tree_id in trees:
        crud.crud_tree.tree.remove(db, id=tree_id)

    return trees


@router.delete("/{tree_id}", response_model=schemas.tree.Tree_xy)
def delete(
    organization_id: int,
    tree_id: int,
    auth=Depends(authorization("trees:delete")),
    db: Session = Depends(get_db),
) -> Any:
    """Deletes a tree"""
    response = crud.crud_tree.tree.remove(db, id=tree_id).to_xy()
    
    return response

@router.post("/{tree_id}/images")
def upload_images(
    tree_id: int,
    organization_id: int,
    auth=Depends(authorization("trees:upload_images")),
    images: List[UploadFile] = File(...)
):
    """
    upload pictures to a tree
    """
    upload_folder: str = f"{settings.UPLOADED_FILES_FOLDER}/organizations/{str(organization_id)}/{str(tree_id)}"

    if os.path.exists(upload_folder) is False:
        os.makedirs(upload_folder)

    total = 0

    for image in images:
        with open(f"{upload_folder}/{image.filename}", "wb") as buffer:
            if imghdr.what(image.file) in ['png', 'gif', 'jpeg']:
                shutil.copyfileobj(image.file, buffer)
                total+=1

    return HTMLResponse(status_code=200, content=f"{total} images uploaded")

@router.get("/{tree_id}/images", dependencies=[Depends(permissive_authorization("trees:get_images"))])
def get_images(
    tree_id: int,
    organization_id: int,
):
    """
    get all images from a tree
    """
    upload_folder: str = f"{settings.UPLOADED_FILES_FOLDER}/organizations/{str(organization_id)}/{str(tree_id)}"
    f = []

    for (dirpath, dirnames, filenames) in os.walk(upload_folder):
        for filename in filenames:
            f.append(f"{settings.EXTERNAL_PATH}/organization/{organization_id}/trees/{tree_id}/images/{filename}")

    return f

@router.get("/{tree_id}/images/{image}")
def get_image(
    image: str,
    tree_id: int,
    organization_id: int,
):
    """
    get one image
    """
    upload_folder: str = f"{settings.UPLOADED_FILES_FOLDER}/organizations/{str(organization_id)}/{str(tree_id)}"
    
    return FileResponse(f"{upload_folder}/{image}")

@router.delete("/{tree_id}/images/")
def delete_images(
    tree_id: int,
    organization_id: int,
    auth=Depends(authorization("trees:delete_images")),
):
    """
    delete all images
    """
    upload_folder: str = f"{settings.UPLOADED_FILES_FOLDER}/organizations/{str(organization_id)}/{str(tree_id)}"

    try: 
        shutil.rmtree(upload_folder)

        return HTMLResponse(status_code=200, content=f"{tree_id}")
    except Exception as e:
        logging.error(e)
        return HTTPException(status_code=500, detail="Can't delete folder")


@router.delete("/{tree_id}/images/{image}")
def delete_image(
    image: str,
    tree_id: int,
    organization_id: int,
    auth=Depends(authorization("trees:delete_image")),
):
    """
    delete one image
    """
    image_path: str = f"{settings.UPLOADED_FILES_FOLDER}/organizations/{str(organization_id)}/{str(tree_id)}/{image}"
    
    try: 
        if os.path.exists(image_path):
            os.remove(image_path)

        return HTMLResponse(status_code=200, content=f"{tree_id}")
    except:
        return HTTPException(status_code=500, detail="Can't delete {image} file")


@router.get("/{tree_id}/interventions", response_model=List[schemas.Intervention])
def get_interventions(
    tree_id: int,
    *,
    auth=Depends(authorization("trees:get_interventions")),
    db: Session = Depends(get_db),
):
    """Get all interventions from a tree"""
    return crud.intervention.get_by_tree(db, tree_id)
