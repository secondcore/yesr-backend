/// <reference path="Libs/jquery-1.7.2.js" />
/// <reference path="Libs/jquery-ui-1.8.20.js" />
/// <reference path="Libs/jquery.validate.js" />
/// <reference path="Libs/jquery.validate.unobtrusive.js" />
/// <reference path="Libs/knockout-2.0.0.debug.js" />
/// <reference path="Libs/modernizr-2.0.6-development-only.js" />
//alert("inside yesr-startup.js");
Ext.Loader.setConfig({
	disableCaching: false
});
//Ext.require(["Ext.container.Container", "Ext.window.MessageBox",
//    "Ext.chart.Chart", "Ext.chart.series.Line", "Ext.chart.series.Bar", "Ext.chart.axis.Numeric", "Ext.chart.axis.Category", "Ext.util.Format",
//    'Ext.data.Model', 'Ext.data.Store', 'Ext.grid.Panel', 'Ext.grid.column.Number']);

window.onerror = function (event) {
	if (arguments[0] != null && arguments[0].indexOf("Error loading script") > -1) return false;
	var er = "Error: " + arguments[0] + "<br/>" +
	"File: " + arguments[1] + "<br/>" +
	"Line: " + arguments[2] + "";

	//window.errors.push({ type: "JS ERROR", ts: new Date(), err: er });
	(yesrFormatter.showError || alert)(er);
	return false;
};

var yesrFormatter = new (function () {
	var me = this;
	var previousPoint = null;
	/*
	The data that this function expects is summarized here:
	var seriesLabels = ["Purchases", "Admin Fees", "Commission", "Support"];
	var dataPointsJson = [
	{ Month: 1, Year: 2012, Value0: 90, Value1: 80, Value2: 60, Value3: 45 },
	{ Month: 2, Year: 2012, Value0: 95, Value1: 78, Value2: 59, Value3: 42 },
	{ Month: 3, Year: 2012, Value0: 97, Value1: 63, Value2: 44, Value3: 41 },
	{ Month: 4, Year: 2012, Value0: 101, Value1: 65, Value2: 55, Value3: 29 },
	{ Month: 5, Year: 2012, Value0: 104, Value1: 71, Value2: 54, Value3: 39 },
	{ Month: 6, Year: 2012, Value0: 97, Value1: 63, Value2: 44, Value3: 41 },
	{ Month: 7, Year: 2012, Value0: 101, Value1: 65, Value2: 55, Value3: 29 },
	{ Month: 8, Year: 2012, Value0: 97, Value1: 63, Value2: 44, Value3: 41 },
	{ Month: 9, Year: 2012, Value0: 101, Value1: 65, Value2: 55, Value3: 29 },
	{ Month: 10, Year: 2012, Value0: 97, Value1: 63, Value2: 44, Value3: 41 },
	{ Month: 11, Year: 2012, Value0: 101, Value1: 65, Value2: 55, Value3: 29 },
	{ Month: 12, Year: 2012, Value0: 104, Value1: 71, Value2: 54, Value3: 39 }
	];
	*/

	this.showError = function (msg) {
		Ext.create('Ext.window.MessageBox', {
			minWidth: 200, minHeight: 100, multiline: false, centered: true, draggable: false, closable: true, listeners: {
				hide: function () { this.destroy(); }
			}, dd: { endDrag: Ext.emptyFn }
		}).show({
			title: "YESR", msg: msg, icon: Ext.MessageBox.ERROR, buttons: Ext.MessageBox.OK
		});
	}

	function getTip(field) {
		return {
			header: true,
			trackMouse: true,
			width: 70,
			height: 40,
			renderer: function (storeItem, item) {
				//console.info(field + "::" + storeItem.get(field));
				this.setTitle("<b>" + storeItem.get('Name2') + "</b><br/>" + Ext.util.Format.number(storeItem.get(field), '0,000.00'));
			}
		};
	}

	this.renderMonthlyGraph = function (el, theme, width, height, labels, data, runTotal, showLegend, showRightAxis) {
		if (Ext.isIterable(el)) el = el[0];

		var panel = Ext.create('Ext.container.Container', { renderTo: el, width: width, height: height, layout: 'fit' });
		panel.setLoading("Loading chart...");

		if (runTotal) {
			var vals = [];
			for (var r = 0; r < data.length; r++) {
				//consoleF.info("runn Total");
				for (i in data[r]) {
					if (i.indexOf('Value') == -1) continue;
					var idx = parseFloat(i.replace('Value', ''));
					if (vals.length == idx) vals.push(data[r][i]);
					else vals[idx] += data[r][i];
					//console.info("Index:" + idx + "  Length:" + vals.length + "  Values:" + data[r][i] + "  Total:" + vals[idx]);
					data[r][i] = vals[idx];
				}
			}
		}

		Ext.define('ChartData', {
			extend: 'Ext.data.Model',
			fields: [
						{ name: 'Name', type: 'string', mapping: 'Month', convert: function (v, rec) {
							return /*Ext.Date.monthNames[rec.data.Month - 1].substring(0, 3)*/rec.data.Month + "/" + (rec.data.Year + "").substring(2);
						}
						},
						{ name: 'Name2', type: 'string', mapping: 'Month', convert: function (v, rec) {
							return Ext.Date.monthNames[rec.data.Month - 1].substring(0, 3) + "/" + (rec.data.Year + "").substring(2);
						}
						},
						{ name: 'Year', type: 'int' },
						{ name: 'Month', type: 'int' },
						{ name: 'Value0', type: 'double' },
						{ name: 'Value1', type: 'double' },
						{ name: 'Value2', type: 'double' },
						{ name: 'Value3', type: 'double' },
						{ name: 'Value4', type: 'double' },
						{ name: 'Value5', type: 'double' }
					]
		});
		var store = Ext.create('Ext.data.Store', {
			model: 'ChartData',
			data: data
		});

		var rightAxisFields = [];
		for (i in labels) {
			if (i == 0) continue;
			rightAxisFields.push("Value" + i);
		}

		var series = [{
			type: 'column',
			axis: 'left',
			highlight: true,
			xField: 'Name',
			title: labels[0],
			yField: 'Value0',
			tips: getTip('Value0')
		}];
		for (i in labels) {
			if (i == 0) continue;
			series.push({
				type: 'line',
				axis: showRightAxis == false ? 'left' : 'right',
				highlight: true,
				xField: 'Name',
				yField: 'Value' + i,
				title: labels[i],
				markerConfig: {
					type: 'circle',
					size: 4,
					radius: 4
				},
				style: {
					'stroke-width': 2
				},
				tips: getTip('Value' + i)
			});
		}

		var fields = ['Value0'];
		if (showRightAxis == false) fields=fields.concat(rightAxisFields);

		var axes = [{
			type: 'Numeric',
			position: 'left',
			fields: fields,
			title: labels[0],
			grid: true,
			minimum: 0
		}, {
			type: 'Category',
			position: 'bottom',
			fields: ['Name'],
			label: { orientation: 'vertical' },
			title: 'Month of the Year'
		}]
		if (showRightAxis != false) {
			axes.push({
				type: 'Numeric',
				position: 'right',
				fields: rightAxisFields,
				grid: false
			});
		}

		var config = {
			xtype: 'chart',
			style: 'background:#fff',
			animate: true,
			theme: theme,
			store: store,
			axes: axes,
			series: series
		};
		if (showLegend != false) {
			config.legend = {
				boxStroke: '#654b24',
				position: 'bottom'
			};
		}

		panel.add(Ext.create("Ext.chart.Chart", config));
		panel.setLoading(false);
	}
	this.renderDistributionGraph = function (el, theme, width, data) {
		if (Ext.isIterable(el)) el = el[0];

		var store = Ext.create('Ext.data.Store', {
			fields: ['Identifier', 'Value'],
			data: data
		});


		Ext.create("Ext.chart.Chart", {
			xtype: 'chart',
			style: 'background:transparent',
			animate: true,
			theme: theme,
			store: store,
			width: width, height: (data.length * 20) + 55,
			renderTo: el,
			axes: [{
				type: 'Numeric',
				position: 'bottom',
				fields: ['Value'],
				minimum: 0,
				dashSize: 0,
				label: { display: 'none', renderer: function () { return ''; } }
			}, {
				type: 'Category',
				position: 'left',
				fields: ['Identifier']
			}],
			series: [{
				type: 'bar',
				highlight: true,
				axis: 'bottom',
				xField: 'Identifier',
				yField: ['Value'],
				style: {
					fill: '#EDE211',
					stroke: '#EDE211'
				},
				label: {
					display: 'insideEnd',
					field: 'Value',
					renderer: Ext.util.Format.numberRenderer('0'),
					orientation: 'horizontal',
					color: '#333',
					'text-anchor': 'middle'
				}
			}]
		});
	}

	this.renderMonthlyChart = function (canvasDiv, width, height, color, seriesLabels, dataPointsJson, runningTotal, legendOrientation) {
		var performRunningTotal = false;
		if (runningTotal != undefined)
			performRunningTotal = runningTotal;

		var legend = "ne";
		if (legendOrientation != undefined)
			legend = legendOrientation;

		var plot = null;
		if (dataPointsJson != null && dataPointsJson.length > 0) {
			var tickLiterals = [];
			var chartSeriesData = [];
			var maxY = 0;
			var maxX = dataPointsJson.length;

			for (var i in dataPointsJson) {
				var dp = dataPointsJson[i];
				tickLiterals.push([i, dp.Month + "-" + dp.Year]);
			}

			for (i in seriesLabels) {
				var seriesLabel = seriesLabels[i];
				var seriesData = [];
				var totalValue = 0;
				for (var j in dataPointsJson) {
					dp = dataPointsJson[j];
					var dpValue = dp["Value" + i];
					totalValue += dpValue;

					if (performRunningTotal == true) {
						if (totalValue > maxY)
							maxY = totalValue;
						seriesData.push([j, totalValue]);
					} else {
						if (dpValue > maxY)
							maxY = dpValue;
						seriesData.push([j, dpValue]);
					}
				}

				if (i == 0)
					chartSeriesData.push({ bars: { show: true, fill: true, barWidth: 0.25, align: "center" }, label: seriesLabel, data: seriesData });
				else
					chartSeriesData.push({ lines: { show: true, fill: false }, points: { show: true, radius: 5 }, shadowSize: 4, label: seriesLabel, data: seriesData });
			}

			// Give the Y axis room to breathe
			maxY += maxY * 0.10;

			var chartOptions = {
				grid: { hoverable: true, autoHighlight: true },
				legend: { position: legend },
				yaxis: { max: maxY, min: 0 },
				xaxis: { max: maxX, min: -1, ticks: tickLiterals }
			};

			canvasDiv.attr('style', 'width:' + width + 'px;height:' + height + 'px;');

			plot = $.plot(canvasDiv, chartSeriesData, chartOptions);

			canvasDiv.bind('plothover', function (event, pos, item) {
				if (item) {
					if (previousPoint != item.datapoint) {
						previousPoint = item.datapoint;

						$('#CanvasTooltip').remove();
						//var x = item.datapoint[0].toFixed(2),
						var y = item.datapoint[1].toFixed(2);

						showTooltip(item.pageX, item.pageY, y);
					}
				} else {
					$("#CanvasTooltip").remove();
					previousPoint = null;
				}
			});

			return plot;
		}
	}
	this.renderIntegerDistributionChart = function (canvasDiv, width, height, color, dataPointsJson, legendOrientation) {
		var legend = "ne";
		if (legendOrientation != undefined)
			legend = legendOrientation;

		var plot = null;
		if (dataPointsJson != null && dataPointsJson.length > 0) {
			var tickLiterals = [];
			var chartSeriesData = [];
			var maxY = dataPointsJson.length;
			var maxX = 0;

			for (var i in dataPointsJson) {
				var dp = dataPointsJson[i];
				tickLiterals.push([i, dp.Identifier]);
			}

			var seriesData = [];
			for (var i in dataPointsJson) {
				dp = dataPointsJson[i];
				var dpValue = dp["Value"];
				if (dpValue > maxX)
					maxX = dpValue;
				seriesData.push([0, i]);
				seriesData.push([dpValue, i]);
				seriesData.push(null);
			}

			chartSeriesData.push({ lines: { show: true, fill: false }, points: { show: true, radius: 5 }, data: seriesData });

			// Give the X axis room to breathe
			maxX += maxX * 0.10;

			var chartOptions = {
				xaxis: { max: maxX, min: 0 },
				yaxis: { max: maxY, min: -1, ticks: tickLiterals }
			};

			canvasDiv.attr('style', 'width:' + width + 'px;height:' + height + 'px;');

			plot = $.plot(canvasDiv, chartSeriesData, chartOptions);

			return plot;
		}
	}
	function showTooltip(x, y, contents) {
		$('<div id="CanvasTooltip">' + contents + '</div>').css({
			position: 'absolute',
			display: 'none',
			top: y + 5,
			left: x + 15,
			border: '1px solid #000',
			padding: '2px',
			'background-color': '#fee',
			opacity: 0.80
		}).appendTo("body").fadeIn(200);
	}
})();

var dataService = new function () {
	var purchasesMonthlyAverageSpends = null,
		purchasesMonthlyTotalSpends = null,
		serviceBase = '/DataService/',
		getPurchasesMonthlyAverageSpendsDataPoints = function (callback, error) {
			$.getJSON(serviceBase + 'RetrievePurchaseMonthlyAverageSpends', {}, function (data) {
				// Cache the data until further call
				purchasesMonthlyAverageSpends = data;
				callback(data);
			}).error(error);
		},
		getPurchasesMonthlyAverageSpendsDataPointsFromCache = function (callback) {
			// return the cached data immediately
			callback(purchasesMonthlyAverageSpends);
		},
		getPurchasesMonthlyAverageSpendsByMerchantDataPoints = function (id, callback, error) {
			$.getJSON(serviceBase + 'RetrievePurchaseMonthlyAverageSpendsByMerchant', {id: id}, function (data) {
				// Cache the data until further call
				purchasesMonthlyAverageSpends = data;
				callback(data);
			}).error(error);
		},
		getPurchasesMonthlyAverageSpendsByMembershipDataPoints = function (id, callback, error) {
			$.getJSON(serviceBase + 'RetrievePurchaseMonthlyAverageSpendsByMembership', { id: id }, function (data) {
				// Cache the data until further call
				purchasesMonthlyAverageSpends = data;
				callback(data);
			}).error(error);
		},
		getPurchasesMonthlyTotalSpendsDataPoints = function (callback, error) {
			$.getJSON(serviceBase + 'RetrievePurchaseMonthlyTotalSpends', {}, function (data) {
				// Cache the data until further call
				purchasesMonthlyTotalSpends = data;
				callback(data);
			}).error(error);
		},
		getPurchasesMonthlyTotalSpendsDataPointsFromCache = function (callback) {
			// return the cached data immediately
			callback(purchasesMonthlyTotalSpends);
		},
		getPurchasesMonthlyTotalSpendsByMerchantDataPoints = function (id, callback, error) {
			$.getJSON(serviceBase + 'RetrievePurchaseMonthlyTotalSpendsByMerchant', {id: id}, function (data) {
				// Cache the data until further call
				purchasesMonthlyTotalSpends = data;
				callback(data);
			}).error(error);
		},
		getPurchasesMonthlyTotalSpendsByMembershipDataPoints = function (id, callback, error) {
			$.getJSON(serviceBase + 'RetrievePurchaseMonthlyTotalSpendsByMembership', { id: id }, function (data) {
				// Cache the data until further call
				purchasesMonthlyTotalSpends = data;
				callback(data);
			}).error(error);
		},
		getMerchantsDistributionByCashDiscountDataPoints = function (callback, error) {
			$.getJSON(serviceBase + 'RetrieveMerchantsDistributionByCashDiscount', {}, function (data) {
				callback(data);
			}).error(error);
		},
		getMerchantsDistributionByTotalDiscountDataPoints = function (callback, error) {
			$.getJSON(serviceBase + 'RetrieveMerchantsDistributionByTotalDiscount', {}, function (data) {
				callback(data);
			}).error(error);
		},
		getMerchantsDistributionByTypeDataPoints = function (callback, error) {
			$.getJSON(serviceBase + 'RetrieveMerchantsDistributionByType', {}, function (data) {
				callback(data);
			}).error(error);
		},
		getMembersDistributionByCityDataPoints = function (callback, error) {
			$.getJSON(serviceBase + 'RetrieveMembersDistributionByCity', { }, function(data) {
				callback(data);
			}).error(error);
		},
		getMembersDistributionByChannelDataPoints = function(callback, error) {
			$.getJSON(serviceBase + 'RetrieveMembersDistributionByEnrollmentChannel', {}, function (data) {
				callback(data);
			}).error(error);
		},
		getMembersDistributionByCitizenshipCountryDataPoints = function (callback, error) {
			$.getJSON(serviceBase + 'RetrieveMembersDistributionByCitizenshipCountry', {}, function (data) {
				callback(data);
			}).error(error);
		},
		getMonthlyEnrollmentsByMerchantDataPoints = function (id, callback, error) {
			$.getJSON(serviceBase + 'RetrieveMonthlyEnrollmentsByMerchant', {id: id}, function (data) {
				callback(data);
			}).error(error);
		},
		getMonthlyCashDiscountVsReferralBonusByMerchant = function (id, callback, error) {
			$.getJSON(serviceBase + 'RetrieveMonthlyCashDiscountVsReferralBonusByMerchant', { id: id }, function (data) {
				callback(data);
			}).error(error);
		},
        getMonthlyTotalBondAmountsBySponsor = function (id, callback, error) {
            $.getJSON(serviceBase + 'RetrieveMonthlyTotalBondAmountsBySponsor', { id: id }, function (data) {
                callback(data);
            }).error(error);
        },
        getMonthlyStatsByMembership = function (id, callback, error) {
            $.getJSON(serviceBase + 'RetrieveMonthlyStatsByMembership', { id: id }, function (data) {
                callback(data);
            }).error(error);
        };

	return {
		getPurchasesMonthlyAverageSpendsDataPoints: getPurchasesMonthlyAverageSpendsDataPoints,
		getPurchasesMonthlyAverageSpendsDataPointsFromCache: getPurchasesMonthlyAverageSpendsDataPointsFromCache,
		getPurchasesMonthlyAverageSpendsByMerchantDataPoints: getPurchasesMonthlyAverageSpendsByMerchantDataPoints,
		getPurchasesMonthlyAverageSpendsByMembershipDataPoints: getPurchasesMonthlyAverageSpendsByMembershipDataPoints,
		getPurchasesMonthlyTotalSpendsDataPoints: getPurchasesMonthlyTotalSpendsDataPoints,
		getPurchasesMonthlyTotalSpendsDataPointsFromCache: getPurchasesMonthlyTotalSpendsDataPointsFromCache,
		getPurchasesMonthlyTotalSpendsByMerchantDataPoints: getPurchasesMonthlyTotalSpendsByMerchantDataPoints,
		getPurchasesMonthlyTotalSpendsByMembershipDataPoints: getPurchasesMonthlyTotalSpendsByMembershipDataPoints,
		getMerchantsDistributionByCashDiscountDataPoints: getMerchantsDistributionByCashDiscountDataPoints,
		getMerchantsDistributionByTotalDiscountDataPoints: getMerchantsDistributionByTotalDiscountDataPoints,
		getMerchantsDistributionByTypeDataPoints: getMerchantsDistributionByTypeDataPoints,
		getMembersDistributionByCityDataPoints: getMembersDistributionByCityDataPoints,
		getMembersDistributionByChannelDataPoints: getMembersDistributionByChannelDataPoints,
		getMembersDistributionByCitizenshipCountryDataPoints: getMembersDistributionByCitizenshipCountryDataPoints,
		getMonthlyEnrollmentsByMerchantDataPoints: getMonthlyEnrollmentsByMerchantDataPoints,
		getMonthlyCashDiscountVsReferralBonusByMerchant: getMonthlyCashDiscountVsReferralBonusByMerchant,
		getMonthlyTotalBondAmountsBySponsor: getMonthlyTotalBondAmountsBySponsor,
		getMonthlyStatsByMembership: getMonthlyStatsByMembership
	};
} ();


