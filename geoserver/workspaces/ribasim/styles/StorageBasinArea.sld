<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:se="http://www.opengis.net/se" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <se:Name>StorageBasinarea</se:Name>
    <UserStyle>
      <se:Name>StorageBasinarea</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>Single symbol</se:Name>
          <se:MaxScaleDenominator>200000</se:MaxScaleDenominator>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">
              <ogc:PropertyName>meta_color</ogc:PropertyName>
              </se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.4</se:SvgParameter>
            </se:Fill>
            						<se:Stroke>
							<se:SvgParameter name="stroke">#265980</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                            <se:SvgParameter name="stroke-opacity">0.4</se:SvgParameter>
						</se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
                      				<se:Rule>
                    					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>meta_streefpeil</ogc:PropertyName>
                <ogc:Literal>-999</ogc:Literal>
            </ogc:PropertyIsGreaterThan>
					</ogc:Filter>
					<se:MaxScaleDenominator>50000</se:MaxScaleDenominator>
					<se:TextSymbolizer>
						<se:Label>
					    <ogc:Function name="Concatenate">
                          <ogc:Literal>SP:&#xA0;</ogc:Literal>
                        <ogc:PropertyName>meta_streefpeil</ogc:PropertyName>
                        <ogc:Literal>&#xA0;[m NAP]</ogc:Literal>
                    </ogc:Function>
						</se:Label>
						<se:Font>
							<se:SvgParameter name="font-family">Arial</se:SvgParameter>
							<se:SvgParameter name="font-size">13</se:SvgParameter>
						</se:Font>
                              <se:LabelPlacement>
                <se:PointPlacement>
                    <se:AnchorPoint>
                        <se:AnchorPointX>0.5</se:AnchorPointX> <!-- Center label horizontally -->
                        <se:AnchorPointY>0.5</se:AnchorPointY> <!-- Center label vertically -->
                    </se:AnchorPoint>
                    <se:Displacement>
                        <se:DisplacementX>0</se:DisplacementX> <!-- No displacement -->
                        <se:DisplacementY>0</se:DisplacementY> <!-- No displacement -->
                    </se:Displacement>
                </se:PointPlacement>
        </se:LabelPlacement>
						<se:Fill>
							<se:SvgParameter name="fill">#323232</se:SvgParameter>
						</se:Fill>
           <se:VendorOption name="maxDisplacement">8</se:VendorOption>
            <se:VendorOption name="conflictResolution">true</se:VendorOption> <!-- Prevent overlapping labels -->
            <se:VendorOption name="partials">false</se:VendorOption> <!-- Ensure labels are placed only on fully visible polygons -->
            <se:VendorOption name="allowOverlap">false</se:VendorOption> <!-- Prevent overlap across tiles -->

					</se:TextSymbolizer>
				</se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>