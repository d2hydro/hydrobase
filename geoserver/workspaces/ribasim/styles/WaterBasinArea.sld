<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" version="1.1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:se="http://www.opengis.net/se" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd">
	<NamedLayer>
		<se:Name>WaterBasinArea</se:Name>
		<UserStyle>
			<se:Name>WaterBasinArea</se:Name>
			<se:FeatureTypeStyle>
				<se:Rule>
					<se:Name>National main system</se:Name>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>meta_zoom_level</ogc:PropertyName>
							<ogc:Literal>0</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:MaxScaleDenominator>1600000</se:MaxScaleDenominator>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:SvgParameter name="fill">#377eb8</se:SvgParameter>
							<se:SvgParameter name="fill-opacity">0.5</se:SvgParameter>
						</se:Fill>
						<se:Stroke>
							<se:SvgParameter name="stroke">#265980</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
				</se:Rule>
			</se:FeatureTypeStyle>
			<se:FeatureTypeStyle>
				<se:Rule>
					<se:Name>Regional main system</se:Name>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>meta_zoom_level</ogc:PropertyName>
							<ogc:Literal>1</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:MaxScaleDenominator>1000000</se:MaxScaleDenominator>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:SvgParameter name="fill">#377eb8</se:SvgParameter>
							<se:SvgParameter name="fill-opacity">0.5</se:SvgParameter>
						</se:Fill>
						<se:Stroke>
							<se:SvgParameter name="stroke">#265980</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
				</se:Rule>
			</se:FeatureTypeStyle>
			<se:FeatureTypeStyle>
				<se:Rule>
					<se:Name>Regional sub system</se:Name>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>meta_zoom_level</ogc:PropertyName>
							<ogc:Literal>2</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:MaxScaleDenominator>200000</se:MaxScaleDenominator>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:SvgParameter name="fill">#377eb8</se:SvgParameter>
							<se:SvgParameter name="fill-opacity">0.5</se:SvgParameter>
						</se:Fill>
						<se:Stroke>
							<se:SvgParameter name="stroke">#265980</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
				</se:Rule>
			</se:FeatureTypeStyle>
                     <se:FeatureTypeStyle>
                <!-- Add a new rule for the label -->
                <se:Rule>
                    <se:Name>Label meta_streefpeil</se:Name>
                  
                   <ogc:Filter>
                        <!-- Check if meta_streefpeil is greater than or equal to 0 -->
                        <ogc:PropertyIsGreaterThanOrEqualTo>
                            <ogc:PropertyName>meta_streefpeil</ogc:PropertyName>
                            <ogc:Literal>-9999</ogc:Literal>
                        </ogc:PropertyIsGreaterThanOrEqualTo>
                    </ogc:Filter>
                  <se:MaxScaleDenominator>150000</se:MaxScaleDenominator>
                    <se:TextSymbolizer>
                        <se:Label>
                            <ogc:Function name="Concatenate">
                                <ogc:Literal>SP</ogc:Literal>
                                <ogc:Literal>&#160;</ogc:Literal>
                                <ogc:PropertyName>meta_streefpeil</ogc:PropertyName>
                               <ogc:Literal>&#160;</ogc:Literal>
                                <ogc:Literal> m[NAP]</ogc:Literal>
                            </ogc:Function>
                        </se:Label>
						<se:Font>
							<se:SvgParameter name="font-family">Arial</se:SvgParameter>
							<se:SvgParameter name="font-size">13</se:SvgParameter>
						</se:Font>
                        <se:LabelPlacement>
                            <se:PointPlacement>
                                <se:AnchorPoint>
                                    <se:AnchorPointX>0.5</se:AnchorPointX>
                                    <se:AnchorPointY>0.5</se:AnchorPointY>
                                </se:AnchorPoint>
                            </se:PointPlacement>
                        </se:LabelPlacement>
                        <se:Fill>
                            <se:SvgParameter name="fill">#000000</se:SvgParameter>
                        </se:Fill>
                    </se:TextSymbolizer>
                </se:Rule>
            </se:FeatureTypeStyle>
		</UserStyle>
	</NamedLayer>
</StyledLayerDescriptor>