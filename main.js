var margin = { top: 50, right: 80, bottom: 340, left: 80 },
    width = Math.min(700, window.innerWidth - margin.left - margin.right),
    height = Math.min(450, window.innerHeight - margin.top - margin.bottom);

var pageNum = 0;

function titleCase(str) {
    var strList = str.split(" ");
    for (var i = 0; i < strList.length; i++) {
        strList[i] = strList[i].charAt(0).toUpperCase() + strList[i].substring(1);
    }
    return strList.join(" ");
}

function nextPage() {
    if (pageNum < 8) {
        pageNum += 1;
        goToPage(pageNum);
    }
}

function prevPage() {
    if (pageNum > 1) {
        pageNum -= 1;
        goToPage(pageNum);
    }
}

function goToPage(pageNum) {
    d3.select("#pageNum").text("Page " + pageNum + " / 8").style("font-size", "20px")
    switch (pageNum) {
        case 1:
            introClick();
            break;
        case 2:
            pageOneClick();
            break;
        case 3:
            pageTwoClick();
            break;
        case 4:
            pageThreeClick();
            break;
        case 5:
            pageFourClick();
            break;
        case 6:
            pageFiveClick();
            break;
        case 7:
            pageSixClick();
            break;
        case 8:
            conclusionClick();
            break;
    }
}

function init() {
    d3.csv("data_modified.csv").then(function (csvData) {
        csvData = csvData.filter(d => d.year != 2016)
        window.csvData = csvData;
        window.year = [...new Set(csvData.map(d => d.year))].sort();
        window.yearsChoice = [...new Set(csvData.map(d => d.year))].sort();
        window.age = [...new Set(csvData.map(d => d.age))];
        window.continent = [...new Set(csvData.map(d => d.Continent))];
        window.continent.sort();
        window.yearsChoice.splice(0, 0, "Overall");
        window.continent.splice(0, 0, "Overall");

        var dataByYear = d3.nest()
            .key(function (d) { return d.year; })
            .rollup(function (v) {
                return {
                    suicidePer100k: 100000 * d3.sum(v, function (d) { return d.suicides_no; }) / d3.sum(v, function (d) { return d.population; }),
                    suicidePer100kMale: 100000 * d3.sum(v, function (d) { return d.sex == "male" ? d.suicides_no : 0; }) / d3.sum(v, function (d) { return d.sex == "male" ? d.population : 0; }),
                    suicidePer100kFemale: 100000 * d3.sum(v, function (d) { return d.sex == "female" ? d.suicides_no : 0; }) / d3.sum(v, function (d) { return d.sex == "female" ? d.population : 0; }),
                    suicidePer100k5To14: 100000 * d3.sum(v, function (d) { return d.age == "5-14 years" ? d.suicides_no : 0; }) / d3.sum(v, function (d) { return d.age == "5-14 years" ? d.population : 0; }),
                    suicidePer100k15To24: 100000 * d3.sum(v, function (d) { return d.age == "15-24 years" ? d.suicides_no : 0; }) / d3.sum(v, function (d) { return d.age == "15-24 years" ? d.population : 0; }),
                    suicidePer100k25To34: 100000 * d3.sum(v, function (d) { return d.age == "25-34 years" ? d.suicides_no : 0; }) / d3.sum(v, function (d) { return d.age == "25-34 years" ? d.population : 0; }),
                    suicidePer100k35To54: 100000 * d3.sum(v, function (d) { return d.age == "35-54 years" ? d.suicides_no : 0; }) / d3.sum(v, function (d) { return d.age == "35-54 years" ? d.population : 0; }),
                    suicidePer100k55To74: 100000 * d3.sum(v, function (d) { return d.age == "55-74 years" ? d.suicides_no : 0; }) / d3.sum(v, function (d) { return d.age == "55-74 years" ? d.population : 0; }),
                    suicidePer100k75Up: 100000 * d3.sum(v, function (d) { return d.age == "75+ years" ? d.suicides_no : 0; }) / d3.sum(v, function (d) { return d.age == "75+ years" ? d.population : 0; }),
                    gdpByYear: d3.sum(v, d => (d["gdp_per_capita ($)"] * d.population)) / d3.sum(v, d => d.population)
                };
            })
            .sortKeys((a, b) => a - b)
            .entries(csvData);
        var suicidePer100k = [];
        var suicidePer100kMale = [];
        var suicidePer100kFemale = [];
        var suicidePer100k5To14 = [];
        var suicidePer100k15To24 = [];
        var suicidePer100k25To34 = [];
        var suicidePer100k35To54 = [];
        var suicidePer100k55To74 = [];
        var suicidePer100k75Up = [];
        var gdpByYear = [];


        dataByYear.forEach(function (d) {
            suicidePer100k.push({ key: d.key, value: d.value.suicidePer100k });
            suicidePer100kMale.push({ key: d.key, value: d.value.suicidePer100kMale });
            suicidePer100kFemale.push({ key: d.key, value: d.value.suicidePer100kFemale });
            suicidePer100k5To14.push({ key: d.key, value: d.value.suicidePer100k5To14 });
            suicidePer100k15To24.push({ key: d.key, value: d.value.suicidePer100k15To24 });
            suicidePer100k25To34.push({ key: d.key, value: d.value.suicidePer100k25To34 });
            suicidePer100k35To54.push({ key: d.key, value: d.value.suicidePer100k35To54 });
            suicidePer100k55To74.push({ key: d.key, value: d.value.suicidePer100k55To74 });
            suicidePer100k75Up.push({ key: d.key, value: d.value.suicidePer100k75Up });
            gdpByYear.push({ key: d.key, value: d.value.gdpByYear });
        });
        suicidePer100k5To14 = suicidePer100k5To14.filter(d => !Number.isNaN(d.value));
        window.suicidePer100k = suicidePer100k;
        window.suicidePer100kMale = suicidePer100kMale;
        window.suicidePer100kFemale = suicidePer100kFemale;
        window.suicidePer100k5To14 = suicidePer100k5To14;
        window.suicidePer100k15To24 = suicidePer100k15To24;
        window.suicidePer100k25To34 = suicidePer100k25To34;
        window.suicidePer100k35To54 = suicidePer100k35To54;
        window.suicidePer100k55To74 = suicidePer100k55To74;
        window.suicidePer100k75Up = suicidePer100k75Up;
        window.gdpByYear = gdpByYear;
        window.averageOverall = d3.mean(suicidePer100k.map(d => d.value));
        nextPage();
    });
}

function introClick() {
    clearPrev();
    d3.select("#hideOnIntro").text("");
    d3.select("h1").text("Introduction");
    d3.select("body").append("h2").text("Why").attr("class", "intro");
    d3.select("body").append("p").html("<br>Many people are dying from suicide every year, and I want to use a visual way to show user that suicide is not uncommon, and finding out which group of people might have higher chance of committing suicide, so that we can give people more care. <br><br>").attr("class", "intro");

    d3.select("body").append("h2").text("How").attr("class", "intro");
    d3.select("body").append("p").html("<br>I will use visualization of different factors such as stats in different continent, GDP per capita, gender, and age group, vs suicide rate to findout<br><br>").attr("class", "intro");
}

function conclusionClick() {
    clearPrev();
    d3.select("#hideOnIntro").text("");
    d3.select("h1").text("Conclusion");
    d3.select("body").append("h2").text("Conclusion").attr("class", "intro");
    d3.select("body").append("p").html("<br>Based on the statistics and data, we can see that gender and age group do play a role in terms of suicide rates. We can see clearly that male tend to have higher suicide rate than female, and as people grow older, the suicide rate tend to increase. On the other hand, we can see ecomonics does not play a significant role here. <br><br>").attr("class", "intro");
    d3.select("body").append("br")

    d3.select("body").append("h2").text("Tips").attr("class", "intro");
    d3.select("body").append("p").html("<br>Here is a link I find useful if someone ever tells you he/she is thinking of suicide.<br><br>").attr("class", "intro").append("a").property("href", "https://afsp.org/story/if-someone-tells-you-they-re-thinking-about-suicide-a-realconvo-guide-from-afsp").property("target", "_blank").text("If Someone Tells You They're Thinking About Suicide");
    d3.select("body").append("br")
    d3.select("body").append("br")
    d3.select("body").append("h2").text("Resources").attr("class", "intro");
    d3.select("body").append("p").html("<br>Data comes from: (also did some pre-process on the data) <br><br>").attr("class", "intro").append("a").property("href", "https://www.kaggle.com/russellyates88/suicide-rates-overview-1985-to-2016").property("target", "_blank").text("Suicide Rates Overview 1985 to 2016");
};

function pageOneClick() {
    clearPrev();
    d3.select("#hideOnIntro").text("Mouseover to see the exact number");
    var showContinent = false;
    var showContinentButton = d3.select("body").append("div").attr("class", "center-div").append("button").property("type", "button").text("Click To Show Continent Data");
    d3.select("h1").text("Trend Of Changes In Suicide Rate vs Time");
    var data = [{ type: "overall", data: suicidePer100k, desc: "Overall" }];
    showContinentButton.on("click", function () {
        d3.selectAll("svg").remove();
        showContinent = !showContinent;
        if (showContinent) {
            showContinentButton.text("Click To Only Show Overall Data");
            data = [];
            continent.forEach(d => {
                var val = d.split(" ").join("-").toLowerCase();
                var desc = d;
                var tempByYear = d3.nest()
                    .key(d1 => d1.year)
                    .rollup(function (v) {
                        return 100000 * d3.sum(v, function (d) { return d.Continent == desc ? d.suicides_no : 0; }) / d3.sum(v, function (d) { return d.Continent == desc ? d.population : 0; });
                    })
                    .sortKeys((a, b) => a - b)
                    .entries(csvData);
                data.push({ type: val, data: val == 'overall' ? suicidePer100k : tempByYear, desc: desc })
            });
        } else {
            showContinentButton.text("Click To Show Continent Data");
            data = [{ type: "overall", data: suicidePer100k, desc: "Overall" }];
        }
        updateLine(data);
    });
    updateLine(data);
    d3.select("body").append("h2").text("Some Insight:").attr("class", "insight");
    d3.select("body").append("p").text("We can see that for recent years, Africa has the lowest # of suicide per 100k, and South America always have much lower # of suicide per 100k. We can also see the decline of suicide rate over the years. ").attr("class", "insight");
}


function pageTwoClick() {
    clearPrev();
    var data = [];
    d3.select("h1").text("Trend Of Changes In Suicide Rate vs Time One Continent At A Time");
    data.push({ type: "overall", data: suicidePer100k, desc: "Overall" });

    var selectDiv = d3.select("body").append("div").attr("class", "center-div");
    selectDiv.append("span").style("padding-left", "20px").style("padding-right", "20px").style("font-size", "20px").html("Continent: ");
    selectDiv.append("select").attr("class", "select").selectAll("option").data(continent).enter().append("option")
        .property("value", d => d.split(" ").join("-").toLowerCase()).text(d => d);

    selectDiv.select("select").on("change", function () {

        d3.selectAll("svg").remove();

        var desc = titleCase(this.value.split("-").join(" "));
        data = [];
        var tempSuicideByYear = d3.nest()
            .key(function (d) { return d.year; })
            .rollup(function (v) {
                return 100000 * d3.sum(v, function (d) { return d.Continent == desc ? d.suicides_no : 0; }) / d3.sum(v, function (d) { return d.Continent == desc ? d.population : 0; });
            })
            .sortKeys((a, b) => a - b)
            .entries(csvData);
        data.push({ type: this.value, data: this.value == 'overall' ? suicidePer100k : tempSuicideByYear, desc: desc })
        updateLine(data);
    });
    updateLine(data);
    d3.select("body").append("h2").text("Some Insight:").attr("class", "insight");
    d3.select("body").append("p").text("We can see that for recent years, Africa has the lowest # of suicide per 100k, and South America always have much lower # of suicide per 100k. We can also see the decline of suicide rate over the years. ").attr("class", "insight");
}

function pageThreeClick() {
    clearPrev();
    var data = [];
    d3.select("h1").text("Correlation Between Suicide Rate And Economics Over The Year");
    data.push({ type: "suicide-rate", data: suicidePer100k, desc: "# of Suicides Per 100K for Overall" });
    var gdpData = [];
    gdpData.push({ type: "gdp", data: gdpByYear, desc: "Gdp Per Capita for Overall" });
    var selectDiv = d3.select("body").append("div").attr("class", "center-div");
    selectDiv.append("span").style("padding-left", "20px").style("padding-right", "20px").style("font-size", "20px").html("Select A Continent: ");
    selectDiv.append("select").attr("class", "select").selectAll("option").data(continent).enter().append("option")
        .property("value", d => d.split(" ").join("-").toLowerCase()).text(d => d);

    selectDiv.select("select").on("change", function () {
        d3.selectAll("svg").remove();

        var desc = titleCase(this.value.split("-").join(" "));
        data = [];
        gdpData = [];
        var tempByYear = d3.nest()
            .key(function (d) { return d.year; })
            .rollup(function (v) {
                return 100000 * d3.sum(v, function (d) { return d.Continent == desc ? d.suicides_no : 0; }) / d3.sum(v, function (d) { return d.Continent == desc ? d.population : 0; });
            })
            .sortKeys((a, b) => a - b)
            .entries(csvData);
        var tempGdpByYear = d3.nest()
            .key(function (d) { return d.year; })
            .rollup(function (v) {
                return d3.sum(v, function (d) { return d.Continent == desc ? d["gdp_per_capita ($)"] * d.population : 0; }) / d3.sum(v, function (d) { return (d.Continent == desc && d["gdp_per_capita ($)"] > 0) ? d.population : 0; });
            })
            .sortKeys((a, b) => a - b)
            .entries(csvData)
            .filter(d => !Number.isNaN(d.value) && d.value !== 0);
        data.push({ type: "suicide-rate", data: this.value == 'overall' ? suicidePer100k : tempByYear, desc: "# of Suicides Per 100K for " + desc })
        gdpData.push({ type: "gdp", data: this.value == 'overall' ? gdpByYear : tempGdpByYear, desc: "Gdp Per Capita for " + desc })

        updateLineDualAxis(data, gdpData);
    });
    updateLineDualAxis(data, gdpData);
    d3.select("body").append("h2").text("Some Insight:").attr("class", "insight");
    d3.select("body").append("p").text("We may think that economics play a big role in suicide. However, based on the data, we can see that there is low correlation between economic changes and suicide rate. As we glance between different continent, we can see that suicide rate increases both when GDP per capita increases and decreases, and suicide rate decreases both when GDP per capita increases and decreases. In most continent, during 2008 financial crisis, the suicide rate actually declines.").attr("class", "insight");
}

function pageFourClick() {
    clearPrev();
    var showGdp = false;
    d3.select("h1").text("Correlation Between Suicide Rate And Economics Overall");
    var k = 5;
    var countriesSuicide = d3.nest()
        .key(function (d) { return d.country; }).rollup(function (v) {
            return 100000 * d3.sum(v, function (d) { return d.suicides_no; }) / d3.sum(v, function (d) { return d.population; })
        }).entries(csvData).sort((a, b) => b.value - a.value).filter(d => !Number.isNaN(d.value) && d.value !== 0);
    var data = countriesSuicide.slice(0, k);
    var countriesGdp = d3.nest()
        .key(function (d) { return d.country; }).rollup(function (v) {
            return d3.sum(v, d => (d["gdp_per_capita ($)"] * d.population)) / d3.sum(v, d => d.population);
        }).entries(csvData).sort((a, b) => b.value - a.value).filter(d => data.map(d => d.key).includes(d.key));

    var highestLowestOption = ["Highest", "Lowest"];
    var div = d3.select("body").append("div").attr("class", "center-div");
    div.append("span").style("padding-left", "5px").style("padding-right", "5px").html(" ");
    div.append("select").attr("class", "select").property("id", "highLowSelect").selectAll("option").data(highestLowestOption).enter().append("option")
        .property("value", d => d).text(d => d);
    div.append("span").style("padding-left", "5px").style("padding-right", "5px").html(" ");
    div.append("select").attr("class", "select").property("id", "kSelect").selectAll("option").data(Array(6).fill(5).map((x, y) => x + y)).enter().append("option")
        .property("value", d => d).text(d => d);
    div.append("span").style("padding-left", "5px").style("padding-right", "5px").style("font-size", "20px").html(" countries in terms of # of suicides per 100K ");
    div.append("select").attr("class", "select").property("id", "yearSelect").selectAll("option").data(yearsChoice).enter().append("option").property("value", d => d).text(d => d);

    var showGDPButton = d3.select("body").append("div").attr("class", "center-div").append("button").property("type", "button").text("Show GDP Per Capita Data");
    showGDPButton.on("click", function () {
        showGdp = !showGdp;
        if (!showGdp) {
            showGDPButton.text("Show GDP Per Capita Data");
            d3.selectAll(".axisBlue").remove();
            d3.selectAll(".dot-gdp").remove();
            d3.selectAll(".legend-right").remove();
            d3.selectAll(".bar-legend").remove();
        } else {
            showGDPButton.text("Hide GDP Per Capita Data");
            showGpdPerCapita(data, countriesGdp);
        }
    });
    div.selectAll("select").on("change", function () {
        d3.selectAll("svg").remove();
        var k = d3.select("#kSelect").node().value;
        var yearSelected = d3.select("#yearSelect").node().value;
        var highLow = d3.select("#highLowSelect").node().value;

        if (highLow == "Highest") {
            data = countriesSuicide.slice(0, k);
        } else {
            data = countriesSuicide.slice(-k);
        }

        countriesGdp = d3.nest()
            .key(function (d) { return d.country; }).rollup(function (v) {
                return d3.sum(v, d => (d["gdp_per_capita ($)"] * d.population)) / d3.sum(v, d => d.population);
            }).entries(csvData).sort((a, b) => b.value - a.value).filter(d => data.map(d => d.key).includes(d.key));
        if (yearSelected != 'Overall') {
            countriesSuicide = d3.nest()
                .key(function (d) { return d.country; }).rollup(function (v) {
                    return 100000 * d3.sum(v, function (d) { return d.year == yearSelected ? d.suicides_no : 0; }) / d3.sum(v, function (d) { return d.year == yearSelected ? d.population : 0; })
                }).entries(csvData).filter(d => !Number.isNaN(d.value) && d.value != 0).sort((a, b) => b.value - a.value);
            if (highLow == "Highest") {
                data = countriesSuicide.slice(0, k);
            } else {
                data = countriesSuicide.slice(-k);
            }
            countriesGdp = d3.nest()
                .key(function (d) { return d.country; }).rollup(function (v) {
                    return d3.sum(v, d => (d.year == yearSelected ? d["gdp_per_capita ($)"] * d.population : 0)) / d3.sum(v, d => d.year == yearSelected ? d.population : 0);
                }).entries(csvData).filter(d => data.map(d => d.key).includes(d.key)).sort((a, b) => b.value - a.value);
        } else {
            countriesSuicide = d3.nest()
                .key(function (d) { return d.country; }).rollup(function (v) {
                    return 100000 * d3.sum(v, function (d) { return d.suicides_no; }) / d3.sum(v, function (d) { return d.population; })
                }).entries(csvData).filter(d => !Number.isNaN(d.value) && d.value != 0).sort((a, b) => b.value - a.value);
            if (highLow == "Highest") {
                data = countriesSuicide.slice(0, k);
            } else {
                data = countriesSuicide.slice(-k);
            }
            countriesGdp = d3.nest()
                .key(function (d) { return d.country; }).rollup(function (v) {
                    return d3.sum(v, d => (d["gdp_per_capita ($)"] * d.population)) / d3.sum(v, d => d.population);
                }).entries(csvData).filter(d => data.map(d => d.key).includes(d.key)).sort((a, b) => b.value - a.value);
        }

        updateBar(data);
        if (showGdp) {
            showGpdPerCapita(data, countriesGdp);
        }
    });
    updateBar(data);
    d3.select("body").append("h2").text("Some Insight:").attr("class", "insight");
    d3.select("body").append("p").text("We can see here that for those few countries that have high and low suicide rates, some are relative rich country, and some are relative less developed country, but the richer country also could have high suicide rate, and less developed country could also have low suicide rate. We can get conculsion that economics does not really play a big role in suicide rates.").attr("class", "insight");
}


function pageFiveClick() {
    clearPrev();
    d3.select("h1").text("Correlation Between Suicide Rate And Gender");
    var data = [
        { type: "male", data: suicidePer100kMale, desc: "Male" },
        { type: "female", data: suicidePer100kFemale, desc: "Female" },
    ];
    updateLine(data);
    d3.select("body").append("h2").text("Some Insight:").attr("class", "insight");
    d3.select("body").append("p").text("However, based on the statistics and data, we can see that gender does play a role in terms of suicide rates. We can see clearly that male tend to have higher suicide rate than female.").attr("class", "insight");
}

function pageSixClick() {
    clearPrev();
    d3.select("#hideOnIntro").text("Mouseover to see the exact number");
    d3.select("h1").text("Correlation Between Suicide Rate And Age Range");
    var data = [
        { type: "5To14", data: suicidePer100k5To14, desc: "5~14 Years Old" },
        { type: "15To24", data: suicidePer100k15To24, desc: "15~24 Years Old" },
        { type: "25To34", data: suicidePer100k25To34, desc: "25~34 Years Old" },
        { type: "35To54", data: suicidePer100k35To54, desc: "35~54 Years Old" },
        { type: "55To74", data: suicidePer100k55To74, desc: "55~74 Years Old" },
        { type: "75Up", data: suicidePer100k75Up, desc: "75+ Years Old" }
    ];
    updateLine(data);
    d3.select("body").append("h2").text("Some Insight:").attr("class", "insight");
    d3.select("body").append("p").text("Also, based on the statistics and data, we can see that age group does play a role in terms of suicide rates. We can see clearly that people of age 75 and older have a much higher suicide rate. There could be many causes, for example, it could be lack of being taken care of, or could be suffer from illness. Until now, whether people should practice Euthanasia is still under debate within different countries. Most times poeple want to practice Euthanasia becasue the patience are suffering. ").attr("class", "insight");
}

function showGpdPerCapita(data, countriesGdp) {

    var tooltipDiv = d3.selectAll("body").select("div").append("div")
        .attr("class", "tooltipBar")
        .style("opacity", 0);

    d3.selectAll(".axisBlue").remove();
    var svg = d3.selectAll("body").select("div").select("svg").select("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xScale = d3.scaleBand()
        .rangeRound([0, width])
        .domain(data.map(d => d.key))
        .padding(0.1);

    var yScale1 = d3.scaleLinear()
        .domain([0, (d3.max(countriesGdp.map(dd => dd.value)) + 2000)]) 
        .range([height, 0]); 

    svg.append("g")
        .attr("class", "axisBlue")
        .attr("transform", "translate( " + width + ", 0 )")
        .call(d3.axisRight(yScale1));

    svg.append("text")
        .attr("transform", "translate(" + (width + 80) + ", " + (height / 2) + ")rotate(270)")
        .attr("class", "axisBlue")
        .style("text-anchor", "middle").style("font-size", "20px")
        .text("GDP Per Capita ($)");

    svg.selectAll(".dot-gdp")
        .data(countriesGdp)
        .enter().append("circle")
        .attr("class", "dot-gdp")
        .attr("cx", d => xScale(d.key) + xScale.bandwidth() / 2)
        .attr("cy", d => {
            if (d.value) {
                return yScale1(d.value);
            } else return 0;
        })
        .attr("r", 10)
        .on("mouseover", function (d) {
            d3.select(this).attr("class", "focus");
            tooltipDiv.transition()
                .duration(200)
                .style("opacity", 1);
            tooltipDiv.html("Country: " + d.key + "<br>" + "Gdp Per Capita: $" + (Math.round(d.value * 100) / 100).toFixed(2))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 60) + "px");
        })
        .on("mouseout", function () {
            d3.select(this).attr("class", "dot-gdp");
            tooltipDiv.transition()
                .duration(500)
                .style("opacity", 0);
        });
    svg.append("circle").attr("cx", width - 200).attr("cy", -30 + 15).attr("r", 6).attr("class", "dot-gdp");
    svg.append("text").attr("x", width - 185).attr("y", -30 + 15).text("GDP Per Capita").attr("class", "legend-right").attr("alignment-baseline", "middle");
    svg.append("rect").attr("x", width - 205).attr("y", -30 + 35).attr("width", 10).attr("height", 15).attr("class", "bar-legend");
    svg.append("text").attr("x", width - 185).attr("y", -30 + 45).text("# of Suicides Per 100K").attr("class", "legend-right").attr("alignment-baseline", "middle");
}

function updateBar(data) {
    var svg = d3.selectAll("body").select("div").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + 50)
        .attr("class", "center")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var xScale = d3.scaleBand()
        .rangeRound([0, width])
        .domain(data.map(d => d.key))
        .padding(0.1);
    var yScale = d3.scaleLinear()
        .domain([Math.max(0, d3.min(data.map(d => d.value)) - 10), d3.max(data.map(d => d.value))])
        .range([height, 0]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));
    svg.append("text")
        .attr("transform", "translate(" + width / 2 + "," + (height + 40) + ")")
        .style("text-anchor", "middle").style("font-size", "20px")
        .text("Country");
    svg.append("g")
        .attr("transform", "translate(0, 0)")
        .call(d3.axisLeft(yScale));
    svg.append("text")
        .attr("transform", "translate(-40, " + (height / 2) + ")rotate(270)")
        .style("text-anchor", "middle").style("font-size", "20px")
        .text("# of Suicides Per 100K");

    var div = d3.selectAll("body").select("div").append("div")
        .attr("class", "tooltipBar")
        .style("opacity", 0);

    svg.selectAll(".bar").data(data)
        .enter().append("rect").attr("class", "bar")
        .attr("x", function (d) {
            return xScale(d.key);
        })
        .attr("y", d => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {
            return height - yScale(d.value);
        })
        .on("mouseover", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", 1);
            div.html("Country: " + d.key + "<br>" + "# Suicide: " + (Math.round(d.value * 100) / 100).toFixed(2))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 80) + "px");
        })
        .on("mouseout", function () {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });
}

function updateLine(data) {
    var minMax = findMinMax(data);
    var min = minMax[0];
    var max = Math.max(minMax[1], averageOverall);
    var svg = d3.selectAll("body").select("div").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + 50)
        .attr("class", "center")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var xScale = d3.scaleLinear()
        .domain(d3.extent(year))
        .range([0, width]);
    var yScale = d3.scaleLinear()
        .domain([Math.max(0, min - 5), max])
        .range([height, 0]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));
    svg.append("text")
        .attr("transform", "translate(" + width / 2 + "," + (height + 40) + ")")
        .style("text-anchor", "middle").style("font-size", "20px")
        .text("Year");
    svg.append("g")
        .attr("transform", "translate(0, 0)")
        .call(d3.axisLeft(yScale));
    svg.append("text")
        .attr("transform", "translate(-40, " + (height / 2) + ")rotate(270)")
        .style("text-anchor", "middle").style("font-size", "20px")
        .text("# of Suicides Per 100K");

    svg.append('line').attr("class", "annotation-dash").attr("x1", 0).attr("y1", yScale(averageOverall)).attr("x2", xScale(d3.max(year))).attr("y2", yScale(averageOverall));
    svg.append("text").attr("x", xScale(d3.max(year))).attr("y", yScale(averageOverall) - 5).text("Overall");
    svg.append("text").attr("x", xScale(d3.max(year))).attr("y", yScale(averageOverall) + 10).text("Average");
    svg.append("text").attr("x", xScale(d3.max(year))).attr("y", yScale(averageOverall) + 25).text("Line");


    var line = d3.line()
        .x(d => xScale(d.key))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX)
    var div = d3.selectAll("body").select("div").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    data.forEach((d, i) => {
        d.data = d.data.filter(d => !Number.isNaN(d.value) && d.value !== 0);
        svg.append("path")
            .datum(d.data)
            .attr("class", "line-" + d.type)
            .attr("d", line);
        svg.selectAll(".dot-" + d.type)
            .data(d.data)
            .enter().append("circle")
            .attr("class", "dot-" + d.type)
            .attr("cx", d => xScale(d.key))
            .attr("cy", d => {
                if (d.value) {
                    return yScale(d.value);
                } else return 0;
            })
            .attr("r", 5)
            .on("mouseover", function (d) {
                d3.select(this).attr("class", "focus");
                div.transition()
                    .duration(200)
                    .style("opacity", 1);
                div.html("Year: " + d.key + "<br>" + "# Suicide: " + (Math.round(d.value * 100) / 100).toFixed(2))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 60) + "px");
            })
            .on("mouseout", function () {
                d3.select(this).attr("class", "dot-" + d.type);
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
        svg.append("circle").attr("cx", width - 90).attr("cy", -40 + 15 * (i + 1)).attr("r", 6).attr("class", "dot-" + d.type);
        svg.append("text").attr("x", width - 75).attr("y", -40 + 15 * (i + 1)).text(d.desc).attr("class", "legend").attr("alignment-baseline", "middle");
    });
}
function findMinMax(data) {
    var min = Number.MAX_VALUE;
    var max = -1;

    data.forEach(d => {
        d.data.forEach(dd => {
            if (!Number.isNaN(dd.value)) {
                min = Math.min(min, dd.value);
                max = Math.max(max, dd.value);
            }
        })
    })
    return [min, max];
}
function updateLineDualAxis(data1, data2) {
    var minMax0 = findMinMax(data1);
    var min0 = minMax0[0];
    var max0 = minMax0[1];

    var minMax1 = findMinMax(data2);
    var min1 = 0;
    var max1 = minMax1[1];

    var svg = d3.selectAll("body").select("div").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + 50)
        .attr("class", "center")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xScale = d3.scaleLinear()
        .domain(d3.extent(year))
        .range([0, width]);
    var yScale0 = d3.scaleLinear()
        .domain([Math.max(0, min0 - 5), max0])
        .range([height, 0]);

    var yScale1 = d3.scaleLinear()
        .domain([min1, max1])
        .range([height, 0]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));
    svg.append("text")
        .attr("transform", "translate(" + width / 2 + "," + (height + 40) + ")")
        .text("Year").style("text-anchor", "middle").style("font-size", "20px");
    svg.append("g")
        .attr("transform", "translate(0, 0)")
        .attr("class", "axisOrange")
        .call(d3.axisLeft(yScale0));
    svg.append("text")
        .attr("transform", "translate(" + -40 + ", " + (height / 2) + ")rotate(270)")
        .style("text-anchor", "middle").style("font-size", "20px")
        .text("# of Suicides Per 100K");
    svg.append("g")
        .attr("class", "axisBlue")
        .attr("transform", "translate( " + width + ", 0 )")
        .call(d3.axisRight(yScale1));
    svg.append("text")
        .attr("transform", "translate(" + (width + 80) + ", " + (height / 2) + ")rotate(270)")
        .style("text-anchor", "middle").style("font-size", "20px")
        .text("GDP Per Capita ($)");

    var line0 = d3.line()
        .x(d => xScale(d.key))
        .y(d => yScale0(d.value))
        .curve(d3.curveMonotoneX)

    var line1 = d3.line()
        .x(d => xScale(d.key))
        .y(d => yScale1(d.value))
        .curve(d3.curveMonotoneX)

    var div = d3.selectAll("body").select("div").append("div")
        .attr("class", "tooltipBar")
        .style("opacity", 0);
    data1.forEach((d, i) => {
        d.data = d.data.filter(d => !Number.isNaN(d.value) && d.value !== 0);
        svg.append("path")
            .datum(d.data)
            .attr("class", "line-" + d.type)
            .attr("d", line0);
        svg.selectAll(".dot-" + d.type)
            .data(d.data)
            .enter().append("circle")
            .attr("class", "dot-" + d.type)
            .attr("cx", d => xScale(d.key))
            .attr("cy", d => {
                if (d.value) {
                    return yScale0(d.value);
                } else return 0;
            })
            .attr("r", 5)
            .on("mouseover", function (d) {
                d3.select(this).attr("class", "focus");
                div.transition()
                    .duration(200)
                    .style("opacity", 1);
                div.html("Year: " + d.key + "<br>" + "# Suicide: " + (Math.round(d.value * 100) / 100).toFixed(2))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 60) + "px");
            })
            .on("mouseout", function () {
                d3.select(this).attr("class", "dot-" + d.type);
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        svg.append("circle").attr("cx", width - 200).attr("cy", -40 + 15 * (i + 1)).attr("r", 6).attr("class", "dot-" + d.type);
        svg.append("text").attr("x", width - 185).attr("y", -40 + 15 * (i + 1)).text(d.desc).attr("class", "legend").attr("alignment-baseline", "middle")
    });
    data2.forEach((d, i) => {
        d.data = d.data.filter(d => !Number.isNaN(d.value) && d.value !== 0);
        var year2008Coord = [xScale(2008), yScale1(d.data.filter(d => d.key == 2008)[0].value)];
        svg.append("circle").attr("class", "annotation").attr("cx", year2008Coord[0]).attr("cy", year2008Coord[1]).attr("r", 40);
        svg.append('line').attr("class", "annotation").attr("x1", year2008Coord[0]).attr("y1", year2008Coord[1] + 40).attr("x2", year2008Coord[0]).attr("y2", year2008Coord[1] + 180);
        svg.append("text").attr("x", year2008Coord[0] - 50).attr("y", year2008Coord[1] + 200).text("2008 Financial Crisis");

        svg.append("path")
            .datum(d.data)
            .attr("class", "line-" + d.type)
            .attr("d", line1);
        svg.selectAll(".dot-" + d.type)
            .data(d.data)
            .enter().append("circle")
            .attr("class", "dot-" + d.type)
            .attr("cx", d => xScale(d.key))
            .attr("cy", d => {
                if (d.value) {
                    return yScale1(d.value);
                } else return 0;
            })
            .attr("r", 5)
            .on("mouseover", function (d) {
                d3.select(this).attr("class", "focus");
                div.transition()
                    .duration(200)
                    .style("opacity", 1);
                div.html("Year: " + d.key + "<br>" + "Gdp Per Capita: $" + (Math.round(d.value * 100) / 100).toFixed(2))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 60) + "px");
            })
            .on("mouseout", function () {
                d3.select(this).attr("class", "dot-" + d.type);
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
        svg.append("circle").attr("cx", width - 200).attr("cy", -40 + 15 * (i + 2)).attr("r", 6).attr("class", "dot-" + d.type);
        svg.append("text").attr("x", width - 185).attr("y", -40 + 15 * (i + 2)).text(d.desc).attr("class", "legend").attr("alignment-baseline", "middle")
    });
}

function clearPrev() {
    d3.selectAll("body").selectAll("div").selectAll("div").remove();
    d3.selectAll("body").selectAll("div").selectAll("svg").remove();
    d3.selectAll(".center-div").remove();
    d3.selectAll(".insight").remove();
    d3.selectAll(".intro").remove();
}

init();
