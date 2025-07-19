function simulatesamplepath() {  

  // Select SVG 
  const svg = d3.select("svg");
  const width = +svg.attr("width");
  const height = +svg.attr("height");
  // Clear previous plot
  svg.selectAll("*").remove();

 // Parameters
  const mu =parseFloat(document.getElementById("mu").value);        // Drift
  const sigma =  parseFloat(document.getElementById("sigma").value);     // Volatility
  const S0 = 75;        // Initial price
  const T = 1;           // Time horizon (in years)
  const N = 250;         // Number of time steps (e.g. daily steps)
  const dt = T / N;
  const num_sample_path=parseInt(document.getElementById("numPaths").value);

   // Generate Brownian motion with drift

 const allPaths = [];

 for (let m = 0; m < num_sample_path; m++) {
  let prices = [{ t: 0, S: S0 }];
  for (let i = 1; i <= N; i++) {
    const prev = prices[i - 1].S;
    const Z = d3.randomNormal(0, 1)();
    const next = prev * Math.exp((mu - 0.5 * sigma ** 2) * dt + sigma * Math.sqrt(dt) * Z);
    prices.push({ t: i, S: next });
  }
  allPaths.push(prices)
 }

  const xScale = d3.scaleLinear().domain([0, N]).range([50, width - 20]);
  const yExtent = d3.extent(allPaths.flat(), d => d.S);
   const yScale = d3.scaleLinear().domain(yExtent).nice().range([height - 40, 20]);

  // Axis
  svg.append("g")
     .attr("transform", `translate(0,${height - 30})`)
     .call(d3.axisBottom(xScale));

  svg.append("g")
     .attr("transform", `translate(50,0)`)
     .call(d3.axisLeft(yScale));

  // Line generator
  const line = d3.line()
    .x(d => xScale(d.t))
    .y(d => yScale(d.S));

  // Color scale
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Draw each path
  allPaths.forEach((path, i) => {
    svg.append("path")
      .datum(path)
      .attr("fill", "none")
      .attr("stroke", color(i))
      .attr("stroke-width", 2)
      .attr("d", line);
  });

}

["mu", "sigma", "numPaths"].forEach(id => {
  document.getElementById(id).addEventListener("blur", simulatesamplepath);
});

simulatesamplepath()