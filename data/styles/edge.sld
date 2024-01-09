<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" version="1.1.0" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:se="http://www.opengis.net/se" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ogc="http://www.opengis.net/ogc">
	<NamedLayer>
		<se:Name>Edge</se:Name>
		<UserStyle>
			<se:Name>Edge</se:Name>
			<se:FeatureTypeStyle>
				<se:Rule>
					<se:Name>flow</se:Name>
					<se:Description>
						<se:Title>flow</se:Title>
					</se:Description>
					
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
					<ogc:And>
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>edge_type</ogc:PropertyName>
							<ogc:Literal>flow</ogc:Literal>
						</ogc:PropertyIsEqualTo>
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>zoom_level</ogc:PropertyName>
							<ogc:Literal>0</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:And>
					</ogc:Filter>
					<se:MinScaleDenominator>4000</se:MinScaleDenominator>
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
									<se:Size>11</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
			</se:FeatureTypeStyle>
		</UserStyle>
	</NamedLayer>
</StyledLayerDescriptor>
