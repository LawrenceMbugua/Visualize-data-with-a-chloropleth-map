

        const educationUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
        const countyDataUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
        let countyData
        let educationData

        let canvas = d3.select('#canvas')

        let drawMap = () => {

             canvas.selectAll('path')
             .data(countyData)
             .enter()
             .append('path')
             .attr('d', d3.geoPath())
             .attr('class', 'county')
             .attr('fill', (countyDataItem, ) => {
                let id = countyDataItem['id']
                let county = educationData.find( item => {
                    return item['fips'] == id
                })
                let percentage = county['bachelorsOrHigher']

                if (percentage <= 15) {
                    return 'tomato'
                } else if (percentage <= 30){
                    return 'orange'
                } else if (percentage <= 45) {
                    return 'lightgreen'
                } else {
                    return 'limegreen'
                }
             })
             .attr('data-fips', (countyDataItem) => {
                return countyDataItem['id']
             })
             .attr('data-education', (countyDataItem) => {
                let id = countyDataItem['id']
                let county = educationData.find( item => {
                    return item['fips'] == id
                })
                let percentage = county['bachelorsOrHigher']
                return percentage
             })
             .on('mouseover', (countyDataItem) => {
                let tooltip = d3.select('#tooltip')
                tooltip.transition()
                .style('visibility', 'visible')

                let id = countyDataItem['id']
                let county = educationData.find( item => {
                    return item['fips'] === id
                })

                tooltip.text(
                    `${county['fips']} - ${county['area_name']}, ${county['state']} : ${county['bachelorsOrHigher']}%`
                )

                tooltip.attr('data-education', county['bachelorsOrHigher'])

             })
             .on('mouseout', (countyDataItem) => {
                let tooltip = d3.select('#tooltip')
                tooltip.transition()
                .style('visibility', 'hidden')
             })

        }


        d3.json(countyDataUrl).then(
            (data, error) => {
                if (error) {
                    console.log(error);
                } else {
                    countyData = topojson.feature(data, data.objects.counties).features
                   console.log(countyData);
                    //drawMap()

                    d3.json(educationUrl).then(
                        (data, error) => {
                            if (error) {
                                console.log(error);
                            } else {
                                educationData = data
                                drawMap()
                            }
                        }
                    )
                }

            }
        )
