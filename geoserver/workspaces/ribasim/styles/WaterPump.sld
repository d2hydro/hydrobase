<?xml version="1.0" encoding="UTF-8"?>
<!-- edited with XMLSpy v2019 rel. 3 (x64) (http://www.altova.com) by Daniel Tollenaar (d2hydro) -->
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" version="1.1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:se="http://www.opengis.net/se" xmlns:ogc="http://www.opengis.net/ogc">
	<NamedLayer>
		<se:Name>WaterPump</se:Name>
		<UserStyle>
			<se:Name>WaterPump</se:Name>
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
					<se:PointSymbolizer>
						<se:Graphic>
							<se:Mark>
								<se:WellKnownName>hexagon</se:WellKnownName>
								<se:Fill>
									<se:SvgParameter name="fill">#808080</se:SvgParameter>
								</se:Fill>
								<se:Stroke>
									<se:SvgParameter name="stroke">#232323</se:SvgParameter>
									<se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
								</se:Stroke>
							</se:Mark>
							<se:Size>12</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>Regional main system</se:Name>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>meta_zoom_level</ogc:PropertyName>
							<ogc:Literal>1</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:MaxScaleDenominator>200000</se:MaxScaleDenominator>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:Mark>
								<se:WellKnownName>hexagon</se:WellKnownName>
								<se:Fill>
									<se:SvgParameter name="fill">#808080</se:SvgParameter>
								</se:Fill>
								<se:Stroke>
									<se:SvgParameter name="stroke">#232323</se:SvgParameter>
									<se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
								</se:Stroke>
							</se:Mark>
							<se:Size>14</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>Regional sub system</se:Name>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>meta_zoom_level</ogc:PropertyName>
							<ogc:Literal>2</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:MaxScaleDenominator>50000</se:MaxScaleDenominator>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:Mark>
								<se:WellKnownName>hexagon</se:WellKnownName>
								<se:Fill>
									<se:SvgParameter name="fill">#808080</se:SvgParameter>
								</se:Fill>
								<se:Stroke>
									<se:SvgParameter name="stroke">#232323</se:SvgParameter>
									<se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
								</se:Stroke>
							</se:Mark>
							<se:Size>14</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>

        				<se:Rule>
					<se:MaxScaleDenominator>150000</se:MaxScaleDenominator>
					<se:TextSymbolizer>
						<se:Label>
							<ogc:PropertyName>name</ogc:PropertyName>
						</se:Label>
						<se:Font>
							<se:SvgParameter name="font-family">Arial</se:SvgParameter>
							<se:SvgParameter name="font-size">13</se:SvgParameter>
						</se:Font>
						<se:LabelPlacement>
							<se:PointPlacement>
								<se:AnchorPoint>
									<se:AnchorPointX>0</se:AnchorPointX>
									<se:AnchorPointY>0.5</se:AnchorPointY>
								</se:AnchorPoint>
								<se:Displacement>
									<se:DisplacementX>4.95</se:DisplacementX>
									<se:DisplacementY>4.95</se:DisplacementY>
								</se:Displacement>
							</se:PointPlacement>
						</se:LabelPlacement>
						<se:Fill>
							<se:SvgParameter name="fill">#323232</se:SvgParameter>
						</se:Fill>
						<se:VendorOption name="maxDisplacement">8</se:VendorOption>
					</se:TextSymbolizer>
				</se:Rule>
			</se:FeatureTypeStyle>
		</UserStyle>
	</NamedLayer>
</StyledLayerDescriptor>