import logging
import os
import shutil
from typing import List
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    File,
    UploadFile,
)
from starlette.responses import FileResponse, HTMLResponse
from app.core import (
    authorization,
    permissive_authorization,
    settings,
)
import imghdr

settings.policies["images"] = {
    "trees:upload_images": ["admin", "owner", "manager", "contributor"],
    "trees:get_images": ["admin", "owner", "manager", "contributor", "reader"],
    "trees:delete_images": ["admin", "owner", "manager", "contributor"],
    "trees:delete_image": ["admin", "owner", "manager", "contributor"],
}

router = APIRouter()


@router.post(
    "",
    dependencies=[Depends(authorization("trees:upload_images"))],
)
def upload_images(
    tree_id: int, organization_id: int, images: List[UploadFile] = File(...)
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
            if imghdr.what(image.file) in ["png", "gif", "jpeg"]:
                shutil.copyfileobj(image.file, buffer)
                total += 1

    return HTMLResponse(status_code=200, content=f"{total} images uploaded")


@router.get(
    "",
    dependencies=[Depends(permissive_authorization("trees:get_images"))],
)
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
            f.append(
                f"{settings.EXTERNAL_PATH}/organization/{organization_id}/trees/{tree_id}/images/{filename}"
            )

    return f


@router.get("/{image}")
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


@router.delete(
    "",
    dependencies=[Depends(authorization("trees:delete_images"))],
)
def delete_images(tree_id: int, organization_id: int):
    """
    delete all images
    """
    try:
        upload_folder: str = f"{settings.UPLOADED_FILES_FOLDER}/organizations/{str(organization_id)}/{str(tree_id)}"
        shutil.rmtree(upload_folder)

        return tree_id
    except Exception as e:
        raise HTTPException(status_code=500, detail="Can't delete folder")


@router.delete(
    "/{image}",
    dependencies=[Depends(authorization("trees:delete_image"))],
)
def delete_image(image: str, tree_id: int, organization_id: int):
    """
    delete one image
    """
    image_path: str = f"{settings.UPLOADED_FILES_FOLDER}/organizations/{str(organization_id)}/{str(tree_id)}/{image}"

    try:
        os.remove(image_path)
        return tree_id
    except:
        raise HTTPException(status_code=500, detail="Can't delete {image} file")
