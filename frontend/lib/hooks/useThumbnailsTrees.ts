import useApi from "@/lib/useApi";

export interface ThumbnailsTreesResponse {
  image: string;
}

function useThumbnailsTrees(canonicalName) {

 return async () : Promise<ThumbnailsTreesResponse | {}> => {
  const { apiEOL, apiWikispecies } = useApi().api;

  
  const setSpeciesThumbnailWithWikispecies = async (
    formattedCanonicalName: string
  ) => {
    try {
      const { data, status } = await apiWikispecies.get(
        `/page/summary/${formattedCanonicalName}`
      );
      if (status === 200) {
        if (data.thumbnail.source) {
          return data.thumbnail.source;
        }
      }
    } catch ({ response, request }) {
      if (response) {
        // console.log(response);
      }
    }
  };

  const getSpecies = async (id: number, canonicalName: string) => {
    try {
      const { data, status } = await apiEOL.get(
        `/pages/1.0/${id}.json?details=true&images_per_page=10`
      );
      if (status === 200) {
        if (data.taxonConcept) {
          // setScName(data.taxonConcept.scientificName);
          if (data.taxonConcept.dataObjects?.length > 0) {
            // console.log(data.taxonConcept);
            return data.taxonConcept.dataObjects[0].eolThumbnailURL;
          } else {
            return setSpeciesThumbnailWithWikispecies(
              canonicalName.replace(" ", "_")
            );
          }
        }
      }
    } catch ({ response, request }) {
      if (response) {
        // console.log(response);
      }
    }
  };

    try {
      const { data, status } = await apiEOL.get(
        `/search/1.0.json?q=${canonicalName
          .replace(" x ", " ")
          .replace("‹", "i")}`
      );
      if (status === 200) {
        if (data.results.length > 0) {
          return getSpecies(data.results[0].id, canonicalName);
        }
      }
    } catch ({ response, request }) {
      if (response) {
        console.log(response);
      }
    }
  };

}

export default useThumbnailsTrees;