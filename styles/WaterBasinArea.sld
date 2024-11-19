<?xml version="1.0" encoding="UTF-8"?>
<!-- edited with XMLSpy v2019 rel. 3 (x64) (http://www.altova.com) by Daniel Tollenaar (d2hydro) -->
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
					<se:MaxScaleDenominator>500000</se:MaxScaleDenominator>
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
		</UserStyle>
	</NamedLayer>
</StyledLayerDescriptor>
