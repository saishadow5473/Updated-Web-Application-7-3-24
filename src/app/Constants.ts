export class Constants{
    Colors = ["#db3236", "#3cba54", "f4c20d", "#4885ed"]
    HealthData = ["age", "weight", "height", "bmi", "bmiClass", "bloodType", "flightsClimbed", "steps", "heartRate", "fatRatio", "ecg1", "ecg2",  "ecg3", "ecgBpm", "pulseBpm","temperature", "spo2", "lead1Status", "lead2Status", "lead3Status", "systolic", "diastolic"]
    HealthDataPrefs = {
        "biologicalSex":{
            title: "Biological sex",
            color: "#3498db",
            icon: "fa-genderless",
            name: "biologicalSex",
            shouldShowGraphView: false
        },
        "heartRate":{
            title: "Heart rate",
            color: "#8b0000",
            icon: "fa-heart",
            name: "heartRate",
            shouldShowGraphView: true
        },
        "bloodType":{
            title: "Blood type",
            color: "#1abc9c",
            icon: "fa-tint",
            name: "bloodType",
            shouldShowGraphView: false
        },
        "age":{
            title: "Age",
            color: "#2ecc71",
            icon: "fa-clock",
            name: "age",
            shouldShowGraphView: false
        },
        "weight":{
            title: "Weight",
            color: "#3498db",
            icon: "fa-weight",
            name: "weight",
            shouldShowGraphView: true
        },
        "height":{
            title: "Height",
            color: "#9b59b6",
            icon: "fa-arrows-alt-v",
            name: "height",
            shouldShowGraphView: false
        },
        "bmi":{
            title: "Body Mass Index",
            color: "#34495e",
            icon: "fa-dumbbell",
            name: "bmi",
            shouldShowGraphView: true
        },
        "bmiClass": {
            title: "BMI Class",
            color: "#9b59b6",
            name: "bmiClass",
            icon: "fa-genderless",
            shouldShowGraphView: false
        },
        "flightsClimbed":{
            title: "Flights climbed",
            color: "#e67e22",
            icon: "fa-hiking",
            name: "flightsClimbed",
            shouldShowGraphView: false
        },
        "steps":{
            title: "Step count",
            color: "#e74c3c",
            icon: "fa-walking",
            name: "steps",
            shouldShowGraphView: false
        },
        "fatRatio":{
            title: "Body Fat Percentage",
            color: "#2c3e50",
            icon: "fa-weight-hanging",
            name: "bodyFatPercentage",
            shouldShowGraphView: true
        },
        "ecg1": {
            title: "ECG 1",
            color: "#241E4E",
            icon: "fa-heartbeat",
            name: "ecg1",
            shouldShowGraphView: true,
            isECG: true
        },
        "ecg2": {
            title: "ECG 2",
            color: "#960200",
            icon: "fa-heartbeat",
            name: "ecg2",
            shouldShowGraphView: true,
            isECG: true
        },
        "ecg3": {
            title: "ECG 3",
            color: "#CE6C47",
            icon: "fa-heartbeat",
            name: "ecg3",
            shouldShowGraphView: true,

            isECG: true
        },
        "temperature": {
            title: "Temperature",
            color: "#960200",
            icon: "fa-thermometer-half",
            name:"temperature",
            shouldShowGraphView: false
        },
        "spo2": {
            title: "SPO2",
            color: "#603140",
            icon: "fa-wind",
            name:"spo2",
            shouldShowGraphView: false
        },
        "ecgBpm": {
            title: "ECG",
            color: "#700353",
            icon: "fa-file-medical-alt",
            name: "ecgBpm",
            shouldShowGraphView: true

        },
        "pulseBpm": {
            title: "Pulse",
            color: "#700353",
            icon: "fa-file-medical-alt",
            name: "pulseBpm",
            shouldShowGraphView: true

        },
   
        "lead1Status": {
            title: "Lead 1 Status",
            color: "#320D6D",
            icon: "fa-clipboard-list",
            name: "lead1Status",
            shouldShowGraphView: false
        },
        "lead2Status": {
            title: "Lead 2 Status",
            color: "#603140",
            icon: "fa-clipboard-list",
            name: "lead2Status",
            shouldShowGraphView: false
        },
        "lead3Status": {
            title: "Lead 3 Status",
            color: "#34623F",
            icon: "fa-clipboard-list",
            name: "lead3Status",
            shouldShowGraphView: false
        },
        "systolic": {
            title: "Blood Pressure",
            color: "#700353",
            icon: "fa-file-medical-alt",
            name: "systolic",
            shouldShowGraphView: true
        },
        "diastolic": {
            title: "Blood Pressure",
            color: "#700353",
            icon: "fa-file-medical-alt",
            name: "diastolic",
            shouldShowGraphView: true
        }
    }
}