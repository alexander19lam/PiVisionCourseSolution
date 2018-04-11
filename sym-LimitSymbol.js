(function (PV) {
	"use strict";

	function symbolVis() { };
	PV.deriveVisualizationFromBase(symbolVis);

	var definition = { 
		typeName: "LimitSymbol",
		visObjectType: symbolVis,
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
		getDefaultConfig: function(){ 
			return { 
				Height: 160,
				Width: 250,
				Normal : {limit : "", backgroundColor : "rgba(0,0,0,0)", textColor : "white", valueColor : "#b5e61d", message : "Normal"},
				LOLO : {limit : undefined, backgroundColor : "#ff0000", textColor : "#ffa550", valueColor : "#fff220", message : "Violates LOLO Alarm: "},
				LO : {limit : undefined, backgroundColor : "rgba(0,0,0,0)", textColor : "#ffa550", valueColor : "#fff220", message : "Violates LO Alarm: "},
				HI : {limit : undefined, backgroundColor : "rgba(0,0,0,0)", textColor : "#ffa550", valueColor : "#fff220", message : "Violates HI Alarm: "},
				HIHI : {limit : undefined, backgroundColor : "#ff0000", textColor : "#ffa550", valueColor : "#fff220", message : "Violates HIHI Alarm: "},
				Display : {backgroundColor : "rgba(0,0,0,0)", textColor : "white", valueColor : "#b5e61d", message : "Normal"}
			} 
		},
		configOptions : function(){
			return [
				{
					title : "Format Symbol",
					mode : "Format"
				}
			]
		}
	}

	symbolVis.prototype.init = function(scope, elem, $interval) { 
		this.onDataUpdate = dataUpdate;

		//Initial state
		var state = "";

		function dataUpdate(data){
			console.log(data);
			//Updating Data Label On Sparactic Update
			if (data.Label) {
				scope.Label = data.Label;
				scope.Units = data.Units;
			}
			scope.Value = data.Value;
			scope.Time = data.Time;

			//Checking state to see if we need to change
			checkState(data.Value);
		}

		//Checking whether or not we need to change state based on the value
		function checkState(value){
			//Checking if value updated violates the LO limit set
			if (scope.config.LO.limit != undefined && value <= scope.config.LO.limit) {
				//If value violates LO check if violates LOLO
				if (scope.config.LOLO.limit != undefined && value <= scope.config.LOLO.limit) {
					stateChange("LOLO");
				}
				else{
					//If it does not, it violates LO
					stateChange("LO");
				}
			}
			//Checking if value updated violates the HI limit set
			else if (scope.config.HI.limit != undefined && value >= scope.config.HI.limit) {
				//If value violates HI check if violates HIHI
				if (scope.config.HIHI.limit != undefined && value >= scope.config.HIHI.limit) {
					stateChange("HIHI");
				}
				else{
					stateChange("HI");
				}
			}
			//Nothing is being Violated Change display back to Normal
			else{
				stateChange("Normal");
			}
		}

		//Function to update the state
		function stateChange(newState){
				state = newState;
				scope.config.Display.backgroundColor = scope.config[state].backgroundColor;
				scope.config.Display.textColor = scope.config[state].textColor;
				scope.config.Display.valueColor = scope.config[state].valueColor;
				scope.config.Display.message = scope.config[state].message + scope.config[state].limit;
		}
	};

	PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 
