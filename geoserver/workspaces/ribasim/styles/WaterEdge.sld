<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" version="1.1.0" 
                       xmlns:xlink="http://www.w3.org/1999/xlink" 
                       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                       xmlns:se="http://www.opengis.net/se" 
                       xmlns:ogc="http://www.opengis.net/ogc" 
                       xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd">
  <NamedLayer>
    <se:Name>WaterEdge</se:Name>
    <UserStyle>
      <se:Name>WaterEdge</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>Edge</se:Name>
          <se:MaxScaleDenominator>100000</se:MaxScaleDenominator>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#3690c0</se:SvgParameter>
							<se:SvgParameter name="stroke-width">2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">square</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>filled_arrowhead</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#3690c0</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke/>
                  </se:Mark>
                  <se:Size>10</se:Size>
                </se:Graphic>
                <!-- Define the spacing between each arrowhead -->
                <se:Gap>100000</se:Gap> <!-- Gap in map units (approximate control over spacing) -->
              </se:GraphicStroke>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
 <se:Rule>
  <se:MaxScaleDenominator>100000</se:MaxScaleDenominator>
  <se:TextSymbolizer>
    <se:Label>
      <ogc:PropertyName>name</ogc:PropertyName>
    </se:Label>
    <se:Font>
      <se:SvgParameter name="font-family">Arial</se:SvgParameter>
      <se:SvgParameter name="font-size">13</se:SvgParameter>
    </se:Font>
    <!-- Line placement to follow the line geometry -->
    <se:LabelPlacement>
      <se:LinePlacement>
        <!-- PerpendicularOffset moves the label slightly above or below the line -->
        <se:PerpendicularOffset>12</se:PerpendicularOffset>
      </se:LinePlacement>
    </se:LabelPlacement>
    <se:Fill>
      <se:SvgParameter name="fill">#323232</se:SvgParameter>
      
    </se:Fill>

    <!-- Optional VendorOptions to control label behavior -->
    <se:VendorOption name="repeat">10000</se:VendorOption> <!-- Repeat label every 1000 map units -->
    <se:VendorOption name="maxDisplacement">8</se:VendorOption> <!-- Maximum displacement from line -->
    <se:VendorOption name="autoWrap">100</se:VendorOption> <!-- Auto-wrap long labels at 100 units -->
    <se:VendorOption name="spaceAround">2</se:VendorOption> <!-- Add space around label -->
    <se:VendorOption name="followLine">true</se:VendorOption> <!-- Ensure label follows line curvature -->
  </se:TextSymbolizer>
</se:Rule>
 
        
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>