// const { apiEOL, apiWikispecies } = useApi().api;
  // useEffect(() => {
  //   if (mostRepresentedTaxa.length === 6) {
  //     const mostRepresentedTaxaIds = [];
  //     mostRepresentedTaxa.map((specie) => {
  //       searchSpecies(specie.value).then((id) =>
  //         mostRepresentedTaxaIds.push(id)
  //       );
  //     });
  //     console.log(mostRepresentedTaxaIds);
  //   }
  // }, [mostRepresentedTaxa]);

  // const searchSpecies = async (canonicalName: string) => {
  //   try {
  //     const { data, status } = await apiEOL.get(
  //       `/search/1.0.json?q=${canonicalName
  //         .replace(" x ", " ")
  //         .replace("‹", "i")}`
  //     );
  //     if (status === 200) {
  //       if (data.results.length > 0) {
  //         return data.results[0].id;
  //       }
  //     }
  //   } catch ({ response, request }) {
  //     if (response) {
  //       console.log(response);
  //     }
  //   }
  // };

  
//   const searchSpecies = async (canonicalName: string) => {
//     try {
//       const { data, status } = await apiEOL.get(
//         `/search/1.0.json?q=${canonicalName
//           .replace(" x ", " ")
//           .replace("‹", "i")}`
//       );
//       if (status === 200) {
//         if (data.results.length > 0) {
//           getSpecies(data.results[0].id);
//         }
//       }
//     } catch ({ response, request }) {
//       if (response) {
//         console.log(response);
//       }
//     }
//   };

//   const setSpeciesThumbnailWithWikispecies = async (
//     formattedCanonicalName: string
//   ) => {
//     try {
//       const { data, status } = await apiWikispecies.get(
//         `/page/summary/${formattedCanonicalName}`
//       );
//       if (status === 200) {
//         if (data.thumbnail.source) {
//           setSpeciesThumbnail(data.thumbnail.source);
//         }
//       }
//     } catch ({ response, request }) {
//       if (response) {
//         // console.log(response);
//       }
//     }
//   };

//   const getSpecies = async (id: number) => {
//     try {
//       const { data, status } = await apiEOL.get(
//         `/pages/1.0/${id}.json?details=true&images_per_page=10`
//       );
//       if (status === 200) {
//         if (data.taxonConcept) {
//           setScName(data.taxonConcept.scientificName);
//           data.taxonConcept.dataObjects?.length > 0
//             ? setSpeciesThumbnail(data.taxonConcept.dataObjects[0].eolMediaURL)
//             : setSpeciesThumbnailWithWikispecies(
//                 canonicalName.replace(" ", "_")
//               );
//         }
//       }
//     } catch ({ response, request }) {
//       if (response) {
//         // console.log(response);
//       }
//     }
//   };

//   useEffect(() => {
//     searchSpecies(canonicalName);
//   }, [canonicalName]);


  //LUI PASSER LES 6 especes, récupérer 6 ids/
  //avec les id, requeter sur le ENDPOINT.id, récupérer le nom scientifique ??
  // et le thumbnail, soit avec eol, soit avec wiki