const viewer = new Cesium.Viewer("cesiumContainer", {
  shouldAnimate: true
});

const positionProperty = new Cesium.SampledPositionProperty();

fetch("gmat_satellite_trajectory_full.json")
  .then(response => response.json())
  .then(data => {
    data.forEach(entry => {
      const time = Cesium.JulianDate.fromIso8601(entry.time);
      const position = Cesium.Cartesian3.fromArray(entry.position);
      positionProperty.addSample(time, position);
    });

    const entity = viewer.entities.add({
      id: "AelafSat1",
      name: "AelafSat1",
      availability: new Cesium.TimeIntervalCollection([
        new Cesium.TimeInterval({
          start: positionProperty._property._times[0],
          stop: positionProperty._property._times[positionProperty._property._times.length - 1]
        })
      ]),
      position: positionProperty,
      model: {
        uri: "assets/satellite.glb",
        scale: 500,
        minimumPixelSize: 64},
        
      path: {
        resolution: 60,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.2,
          color: Cesium.Color.CYAN
        }),
        width: 4,
        show: true
      }
    });

    const times = positionProperty._property._times;
    viewer.clock.startTime = times[0];
    viewer.clock.stopTime = times[times.length - 1];
    viewer.clock.currentTime = times[0];
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    viewer.clock.multiplier = 1000;

    viewer.trackedEntity = entity;
  });
