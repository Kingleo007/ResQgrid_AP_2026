# India state boundaries

`india-states.json` is a locally vendored GeoJSON export from the Government of India's BharatMaps state boundary layer:

`https://mapservice.gov.in/gismapservice/rest/services/BharatMapService/Admin_Boundary_District/MapServer/0/query?where=1%3D1&outFields=STNAME%2CSTCODE11&outSR=4326&f=geojson`

The source was retrieved on 2026-11-18 and simplified for dashboard display with a 0.008 degree tolerance. Feature names are retained in `properties.state`.
