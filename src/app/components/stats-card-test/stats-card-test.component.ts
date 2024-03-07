import { Component, OnInit, Input, HostListener, AfterViewInit } from '@angular/core';
import { ShareDataService } from '../../services/customServices/share-data.service';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ConstantsService } from 'src/app/services/constants.service';
declare var $: any

@Component({
  selector: 'app-stats-card-test',
  templateUrl: './stats-card-test.component.html',
  styleUrls: ['./stats-card-test.component.css']
})
export class StatsCardTestComponent implements OnInit, AfterViewInit {
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.view = [parseInt($('.stats-container').width(), 10) - 64, parseInt($('.stats-container').height()) - 30]
  }
  
  @HostListener("click") onClick(){
    if(this.value === '-'){
      return
    }
    $("#ecgGraphChartContainerLead1").hide()
    $("#ecgGraphChartContainerLead2").hide()
    $("#ecgGraphChartContainerLead3").hide()
    $("#ecgGraphChartContainerLead4").hide()
    $("#ecgGraphChartContainerLead5").hide()
    $("#ecgGraphChartContainerLead6").hide()
    this.currentValue = this.value
    this.currentUnit = this.unit
    this.currentTitle = this.title
    this.currentIcon = this.icon
    if(this.color == undefined){
      this.currentColour = "#4885ed"
    }
    else{
      this.currentColour = this.color
    }
    this._data.updateMessage(this.currentTitle, this.currentUnit, this.currentValue, this.currentIcon, this.currentColour);
    $("#vital-stats-board").hide()
    $("#dashboardBannerImg").hide()
    $("#vital-stats-info").show()
    if(this.id === "weightKG"){
      $("#bmiChartContainer").hide()
      $("#ecgChartContainer").hide()
      $("#bpChartContainer").hide()
      $("#bmcChartContainer").hide()
      $("#spo2ChartContainer").hide()
      $("#pulseChartContainer").hide() 
      $("#temperatureChartContainer").hide()      
      $("#weightChartContainer").show()
      $("#pbfChartContainer").hide()
     $("#bmctChartContainer").hide()
     $("#ecwChartContainer").hide()
     $("#icwChartContainer").hide()
     $("#mineralChartContainer").hide()
     $("#proteinChartContainer").hide()
     $("#bfmChartContainer").hide()
     $("#smmChartContainer").hide()
     $("#bcmChartContainer").hide()
     $("#whprChartContainer").hide()
     $("#whtrChartContainer").hide()
     $("#vfChartContainer").hide()
     $("#bmrChartContainer").hide()
    }
    if(this.id === "bmi"){
      $("#weightChartContainer").hide()
      $("#ecgChartContainer").hide()
      $("#bpChartContainer").hide()
      $("#bmcChartContainer").hide()
      $("#spo2ChartContainer").hide()
      $("#pulseChartContainer").hide() 
      $("#temperatureChartContainer").hide()      
      $("#bmiChartContainer").show()
      $("#pbfChartContainer").hide()
     $("#bmctChartContainer").hide()
     $("#ecwChartContainer").hide()
     $("#icwChartContainer").hide()
     $("#mineralChartContainer").hide()
     $("#proteinChartContainer").hide()
     $("#bfmChartContainer").hide()
     $("#smmChartContainer").hide()
     $("#bcmChartContainer").hide()
     $("#whprChartContainer").hide()
     $("#whtrChartContainer").hide()
     $("#vfChartContainer").hide()
     $("#bmrChartContainer").hide()
    }
    if(this.id === "ecgbpm"){
      $("#bmiChartContainer").hide()
      $("#weightChartContainer").hide()
      $("#bpChartContainer").hide()
      $("#bmcChartContainer").hide()
      $("#spo2ChartContainer").hide()
      $("#pulseChartContainer").hide() 
      $("#temperatureChartContainer").hide()      
      $("#ecgChartContainer").show()
      $("#pbfChartContainer").hide()
     $("#bmctChartContainer").hide()
     $("#ecwChartContainer").hide()
     $("#icwChartContainer").hide()
     $("#mineralChartContainer").hide()
     $("#proteinChartContainer").hide()
     $("#bfmChartContainer").hide()
     $("#smmChartContainer").hide()
     $("#bcmChartContainer").hide()
     $("#whprChartContainer").hide()
     $("#whtrChartContainer").hide()
     $("#vfChartContainer").hide()
     $("#bmrChartContainer").hide()
    }
    if(this.id === "bp"){
      $("#bmiChartContainer").hide()
      $("#weightChartContainer").hide()
      $("#ecgChartContainer").hide()
      $("#bmcChartContainer").hide()
      $("#spo2ChartContainer").hide()
      $("#pulseChartContainer").hide() 
      $("#temperatureChartContainer").hide()      
      $("#bpChartContainer").show()
      $("#pbfChartContainer").hide()
     $("#bmctChartContainer").hide()
     $("#ecwChartContainer").hide()
     $("#icwChartContainer").hide()
     $("#mineralChartContainer").hide()
     $("#proteinChartContainer").hide()
     $("#bfmChartContainer").hide()
     $("#smmChartContainer").hide()
     $("#bcmChartContainer").hide()
     $("#whprChartContainer").hide()
     $("#whtrChartContainer").hide()
     $("#vfChartContainer").hide()
     $("#bmrChartContainer").hide()
    }
    if(this.id === "spo2"){
      $("#bmiChartContainer").hide()
      $("#ecgChartContainer").hide()
      $("#bpChartContainer").hide()
      $("#bmcChartContainer").hide()
      $("#spo2ChartContainer").show()
      $("#pulseChartContainer").hide() 
      $("#temperatureChartContainer").hide()      
      $("#weightChartContainer").hide()
      $("#pbfChartContainer").hide()
     $("#bmctChartContainer").hide()
     $("#ecwChartContainer").hide()
     $("#icwChartContainer").hide()
     $("#mineralChartContainer").hide()
     $("#proteinChartContainer").hide()
     $("#bfmChartContainer").hide()
     $("#smmChartContainer").hide()
     $("#bcmChartContainer").hide()
     $("#whprChartContainer").hide()
     $("#whtrChartContainer").hide()
     $("#vfChartContainer").hide()
     $("#bmrChartContainer").hide()
    }
    if(this.id === "pulseBpm"){
      $("#bmiChartContainer").hide()
      $("#ecgChartContainer").hide()
      $("#bpChartContainer").hide()
      $("#bmcChartContainer").hide()
      $("#spo2ChartContainer").hide()
      $("#pulseChartContainer").show() 
      $("#temperatureChartContainer").hide()      
      $("#weightChartContainer").hide()
      $("#pbfChartContainer").hide()
     $("#bmctChartContainer").hide()
     $("#ecwChartContainer").hide()
     $("#icwChartContainer").hide()
     $("#mineralChartContainer").hide()
     $("#proteinChartContainer").hide()
     $("#bfmChartContainer").hide()
     $("#smmChartContainer").hide()
     $("#bcmChartContainer").hide()
     $("#whprChartContainer").hide()
     $("#whtrChartContainer").hide()
     $("#vfChartContainer").hide()
     $("#bmrChartContainer").hide()
    }
    if(this.id === "temperature"){
      $("#bmiChartContainer").hide()
      $("#ecgChartContainer").hide()
      $("#bpChartContainer").hide()
      $("#bmcChartContainer").hide()
      $("#spo2ChartContainer").hide()
      $("#pulseChartContainer").hide() 
      $("#temperatureChartContainer").show()      
      $("#weightChartContainer").hide()
      $("#pbfChartContainer").hide()
     $("#bmctChartContainer").hide()
     $("#ecwChartContainer").hide()
     $("#icwChartContainer").hide()
     $("#mineralChartContainer").hide()
     $("#proteinChartContainer").hide()
     $("#bfmChartContainer").hide()
     $("#smmChartContainer").hide()
     $("#bcmChartContainer").hide()
     $("#whprChartContainer").hide()
     $("#whtrChartContainer").hide()
     $("#vfChartContainer").hide()
     $("#bmrChartContainer").hide()
    }
    if(this.id === "fatRatio"){
      $("#bmiChartContainer").hide()
      $("#ecgChartContainer").hide()
      $("#bpChartContainer").hide()
      $("#bmcChartContainer").show()
      $("#spo2ChartContainer").hide()
      $("#pulseChartContainer").hide() 
      $("#temperatureChartContainer").hide()      
      $("#weightChartContainer").hide()
      $("#pbfChartContainer").hide()
     $("#bmctChartContainer").hide()
     $("#ecwChartContainer").hide()
     $("#icwChartContainer").hide()
     $("#mineralChartContainer").hide()
     $("#proteinChartContainer").hide()
     $("#bfmChartContainer").hide()
     $("#smmChartContainer").hide()
     $("#bcmChartContainer").hide()
     $("#whprChartContainer").hide()
     $("#whtrChartContainer").hide()
     $("#vfChartContainer").hide()
     $("#bmrChartContainer").hide()
    }
    if(this.id === "protien"){
      $("#bmiChartContainer").hide()
      $("#ecgChartContainer").hide()
      $("#bpChartContainer").hide()
      $("#bmcChartContainer").hide()
      $("#spo2ChartContainer").hide()
      $("#pulseChartContainer").hide() 
      $("#temperatureChartContainer").hide()      
      $("#weightChartContainer").hide()
      $("#pbfChartContainer").hide()
     $("#bmctChartContainer").hide()
     $("#ecwChartContainer").hide()
     $("#icwChartContainer").hide()
     $("#mineralChartContainer").hide()
     $("#proteinChartContainer").show()
     $("#bfmChartContainer").hide()
     $("#smmChartContainer").hide()
     $("#bcmChartContainer").hide()
     $("#whprChartContainer").hide()
     $("#whtrChartContainer").hide()
     $("#vfChartContainer").hide()
     $("#bmrChartContainer").hide()
    }
    if(this.id === "extra_cellular_water"){
      $("#bmiChartContainer").hide()
      $("#ecgChartContainer").hide()
      $("#bpChartContainer").hide()
      $("#bmcChartContainer").hide()
      $("#spo2ChartContainer").hide()
      $("#pulseChartContainer").hide() 
      $("#temperatureChartContainer").hide()      
      $("#weightChartContainer").hide()
      $("#pbfChartContainer").hide()
     $("#bmctChartContainer").hide()
     $("#ecwChartContainer").show()
     $("#icwChartContainer").hide()
     $("#mineralChartContainer").hide()
     $("#proteinChartContainer").hide()
     $("#bfmChartContainer").hide()
     $("#smmChartContainer").hide()
     $("#bcmChartContainer").hide()
     $("#whprChartContainer").hide()
     $("#whtrChartContainer").hide()
     $("#vfChartContainer").hide()
     $("#bmrChartContainer").hide()
    }
    if(this.id === "intra_cellular_water"){
      $("#bmiChartContainer").hide()
      $("#ecgChartContainer").hide()
      $("#bpChartContainer").hide()
      $("#bmcChartContainer").hide()
      $("#spo2ChartContainer").hide()
      $("#pulseChartContainer").hide() 
      $("#temperatureChartContainer").hide()      
      $("#weightChartContainer").hide()
      $("#pbfChartContainer").hide()
     $("#bmctChartContainer").hide()
     $("#ecwChartContainer").hide()
     $("#icwChartContainer").show()
     $("#mineralChartContainer").hide()
     $("#proteinChartContainer").hide()
     $("#bfmChartContainer").hide()
     $("#smmChartContainer").hide()
     $("#bcmChartContainer").hide()
     $("#whprChartContainer").hide()
     $("#whtrChartContainer").hide()
     $("#vfChartContainer").hide()
     $("#bmrChartContainer").hide()
    }
    if(this.id === "mineral"){
      $("#bmiChartContainer").hide()
      $("#ecgChartContainer").hide()
      $("#bpChartContainer").hide()
      $("#bmcChartContainer").hide()
      $("#spo2ChartContainer").hide()
      $("#pulseChartContainer").hide() 
      $("#temperatureChartContainer").hide()      
      $("#weightChartContainer").hide()
      $("#pbfChartContainer").hide()
     $("#bmctChartContainer").hide()
     $("#ecwChartContainer").hide()
     $("#icwChartContainer").hide()
     $("#mineralChartContainer").show()
     $("#proteinChartContainer").hide()
     $("#bfmChartContainer").hide()
     $("#smmChartContainer").hide()
     $("#bcmChartContainer").hide()
     $("#whprChartContainer").hide()
     $("#whtrChartContainer").hide()
     $("#vfChartContainer").hide()
     $("#bmrChartContainer").hide()
    }
    if(this.id === "skeletal_muscle_mass"){
      $("#bmiChartContainer").hide()
      $("#ecgChartContainer").hide()
      $("#bpChartContainer").hide()
      $("#bmcChartContainer").hide()
      $("#spo2ChartContainer").hide()
      $("#pulseChartContainer").hide() 
      $("#temperatureChartContainer").hide()      
      $("#weightChartContainer").hide()
      $("#pbfChartContainer").hide()
     $("#bmctChartContainer").hide()
     $("#ecwChartContainer").hide()
     $("#icwChartContainer").hide()
     $("#mineralChartContainer").hide()
     $("#proteinChartContainer").hide()
     $("#bfmChartContainer").hide()
     $("#smmChartContainer").show()
     $("#bcmChartContainer").hide()
     $("#whprChartContainer").hide()
     $("#whtrChartContainer").hide()
     $("#vfChartContainer").hide()
     $("#bmrChartContainer").hide()
    }
    if(this.id === "body_fat_mass"){
      $("#bmiChartContainer").hide()
      $("#ecgChartContainer").hide()
      $("#bpChartContainer").hide()
      $("#bmcChartContainer").hide()
      $("#spo2ChartContainer").hide()
      $("#pulseChartContainer").hide() 
      $("#temperatureChartContainer").hide()      
      $("#weightChartContainer").hide()
      $("#pbfChartContainer").hide()
     $("#bmctChartContainer").hide()
     $("#ecwChartContainer").hide()
     $("#icwChartContainer").hide()
     $("#mineralChartContainer").hide()
     $("#proteinChartContainer").hide()
     $("#bfmChartContainer").show()
     $("#smmChartContainer").hide()
     $("#bcmChartContainer").hide()
     $("#whprChartContainer").hide()
     $("#whtrChartContainer").hide()
     $("#vfChartContainer").hide()
     $("#bmrChartContainer").hide()
    }
    if(this.id === "waist_hip_ratio"){
      $("#bmiChartContainer").hide()
      $("#ecgChartContainer").hide()
      $("#bpChartContainer").hide()
      $("#bmcChartContainer").hide()
      $("#spo2ChartContainer").hide()
      $("#pulseChartContainer").hide() 
      $("#temperatureChartContainer").hide()      
      $("#weightChartContainer").hide()
      $("#pbfChartContainer").hide()
     $("#bmctChartContainer").hide()
     $("#ecwChartContainer").hide()
     $("#icwChartContainer").hide()
     $("#mineralChartContainer").hide()
     $("#proteinChartContainer").hide()
     $("#bfmChartContainer").hide()
     $("#smmChartContainer").hide()
     $("#bcmChartContainer").hide()
     $("#whprChartContainer").show()
     $("#whtrChartContainer").hide()
     $("#vfChartContainer").hide()
     $("#bmrChartContainer").hide()
    }
    if(this.id === "body_cell_mass"){
      $("#bmiChartContainer").hide()
      $("#ecgChartContainer").hide()
      $("#bpChartContainer").hide()
      $("#bmcChartContainer").hide()
      $("#spo2ChartContainer").hide()
      $("#pulseChartContainer").hide() 
      $("#temperatureChartContainer").hide()      
      $("#weightChartContainer").hide()
      $("#pbfChartContainer").hide()
     $("#bmctChartContainer").hide()
     $("#ecwChartContainer").hide()
     $("#icwChartContainer").hide()
     $("#mineralChartContainer").hide()
     $("#proteinChartContainer").hide()
     $("#bfmChartContainer").hide()
     $("#smmChartContainer").hide()
     $("#bcmChartContainer").show()
     $("#whprChartContainer").hide()
     $("#whtrChartContainer").hide()
     $("#vfChartContainer").hide()
     $("#bmrChartContainer").hide()
    }
    if(this.id === "waist_height_ratio"){
      $("#bmiChartContainer").hide()
      $("#ecgChartContainer").hide()
      $("#bpChartContainer").hide()
      $("#bmcChartContainer").hide()
      $("#spo2ChartContainer").hide()
      $("#pulseChartContainer").hide() 
      $("#temperatureChartContainer").hide()      
      $("#weightChartContainer").hide()
      $("#pbfChartContainer").hide()
     $("#bmctChartContainer").hide()
     $("#ecwChartContainer").hide()
     $("#icwChartContainer").hide()
     $("#mineralChartContainer").hide()
     $("#proteinChartContainer").hide()
     $("#bfmChartContainer").hide()
     $("#smmChartContainer").hide()
     $("#bcmChartContainer").hide()
     $("#whprChartContainer").hide()
     $("#whtrChartContainer").show()
     $("#vfChartContainer").hide()
     $("#bmrChartContainer").hide()
    }
    if(this.id === "visceral_fat"){
      $("#bmiChartContainer").hide()
      $("#ecgChartContainer").hide()
      $("#bpChartContainer").hide()
      $("#bmcChartContainer").hide()
      $("#spo2ChartContainer").hide()
      $("#pulseChartContainer").hide() 
      $("#temperatureChartContainer").hide()      
      $("#weightChartContainer").hide()
      $("#pbfChartContainer").hide()
     $("#bmctChartContainer").hide()
     $("#ecwChartContainer").hide()
     $("#icwChartContainer").hide()
     $("#mineralChartContainer").hide()
     $("#proteinChartContainer").hide()
     $("#bfmChartContainer").hide()
     $("#smmChartContainer").hide()
     $("#bcmChartContainer").hide()
     $("#whprChartContainer").hide()
     $("#whtrChartContainer").hide()
     $("#vfChartContainer").show()
     $("#bmrChartContainer").hide()
    }
    if(this.id === "basal_metabolic_rate"){
      $("#bmiChartContainer").hide()
      $("#ecgChartContainer").hide()
      $("#bpChartContainer").hide()
      $("#bmcChartContainer").hide()
      $("#spo2ChartContainer").hide()
      $("#pulseChartContainer").hide() 
      $("#temperatureChartContainer").hide()      
      $("#weightChartContainer").hide()
      $("#pbfChartContainer").hide()
     $("#bmctChartContainer").hide()
     $("#ecwChartContainer").hide()
     $("#icwChartContainer").hide()
     $("#mineralChartContainer").hide()
     $("#proteinChartContainer").hide()
     $("#bfmChartContainer").hide()
     $("#smmChartContainer").hide()
     $("#bcmChartContainer").hide()
     $("#whprChartContainer").hide()
     $("#whtrChartContainer").hide()
     $("#vfChartContainer").hide()
     $("#bmrChartContainer").show()
    }
    if(this.id === "bone_mineral_content"){
      $("#bmiChartContainer").hide()
      $("#ecgChartContainer").hide()
      $("#bpChartContainer").hide()
      $("#bmcChartContainer").hide()
      $("#spo2ChartContainer").hide()
      $("#pulseChartContainer").hide() 
      $("#temperatureChartContainer").hide()      
      $("#weightChartContainer").hide()
      $("#pbfChartContainer").hide()
     $("#bmctChartContainer").show()
     $("#ecwChartContainer").hide()
     $("#icwChartContainer").hide()
     $("#mineralChartContainer").hide()
     $("#proteinChartContainer").hide()
     $("#bfmChartContainer").hide()
     $("#smmChartContainer").hide()
     $("#bcmChartContainer").hide()
     $("#whprChartContainer").hide()
     $("#whtrChartContainer").hide()
     $("#vfChartContainer").hide()
     $("#bmrChartContainer").hide()
    }
    if(this.id === "percent_body_fat"){
      $("#bmiChartContainer").hide()
      $("#ecgChartContainer").hide()
      $("#bpChartContainer").hide()
      $("#bmcChartContainer").hide()
      $("#spo2ChartContainer").hide()
      $("#pulseChartContainer").hide() 
      $("#temperatureChartContainer").hide()      
      $("#weightChartContainer").hide()
      $("#pbfChartContainer").show()
     $("#bmctChartContainer").hide()
     $("#ecwChartContainer").hide()
     $("#icwChartContainer").hide()
     $("#mineralChartContainer").hide()
     $("#proteinChartContainer").hide()
     $("#bfmChartContainer").hide()
     $("#smmChartContainer").hide()
     $("#bcmChartContainer").hide()
     $("#whprChartContainer").hide()
     $("#whtrChartContainer").hide()
     $("#vfChartContainer").hide()
     $("#bmrChartContainer").hide()
    }
  }

  @Input() id: string | undefined
  @Input() title: string | undefined
  @Input() value: string | undefined
  @Input() unit: string | undefined
  @Input() color: string | undefined
  @Input() icon: string | undefined
  @Input() name: string | undefined
  @Input() shouldShowGraphView: boolean | undefined
  @Input() isECG: boolean | undefined
  @Input() graphData: any
  
  bounce = false
  smallText = false
  constructor(private _data: ShareDataService,private dialog: MatDialog,private _constant: ConstantsService) { }
  queryTerm: any;
  currentValue: any
  currentTitle: any
  currentIcon: any
  currentColour: any
  currentUnit: any
  centered = false;
  disabled = false;
  unbounded = false;

  ngOnInit() {
    
    $("#vital-stats-info").hide();

    this.doAnimations()

    if(this.name == 'lead1Status' || this.name == 'lead2Status' || this.name == 'lead3Status'){
      this.smallText = true
    }
    
  }

  ngAfterViewInit(){
    if(this.isECG==true){
      //this.formatECGData();
    }
    if(this.value === '-'){
      document.getElementById(this.name).style.opacity = "0.65"; 
    }
  }

  doAnimations() {
    if (this.icon == "fa-heart") {
      this.bounce = true
    }
  }

  performAnimations() {
    //console.log("perform");

    $('.stats-container-desc-' + this.name).css({
      "transform": "translate(0,8px)",
      "opacity": "0"
    });

    $('.stats-container-value-' + this.name).css({
      "top": "40px",
      "transform": "scale(0.8)"
    });

    $('.stats-container-icon-' + this.name).css({
      "transform": "scale(0.6)",
      "top": "0",
      "left": "12px",
    });

    $('.stats-container-graph-div-' + this.name).css({
      "left": parseInt($('.stats-container-desc-' + this.title).width()) - 40 + 'px',
      "max-width": "80px",
      "overflow": "visible",
      "visibility": "visible",
    })


    this.view = [parseInt($('.stats-container').width(), 10) - 64, parseInt($('.stats-container').height()) - 30]

    this.bounce = false
    this.graphView = true

    // $('.stats-container-desc').animate({tra: '0'})
  }


  resetAnimations() {
    $('.stats-container-desc-' + this.name).css({
      "transform": "translate(0,0)",
      "opacity": "1"
    });

    $('.stats-container-value-' + this.name).css({
      "top": "0px",
      "transform": "scale(1)"
    });

    $('.stats-container-icon-' + this.name).css({
      "transform": "scale(1)",
      "top": "25%",
      "left": "calc(100% - 100px)",
    });

    $('.stats-container-graph-div-' + this.name).css({
      "max-width": "0",
      "overflow": "hidden",
      "visibility": "hidden",
      "transition-delay": "0s"
    })

    this.doAnimations()
  }


  graphView = false
  view: any[] = [700, 400];

  // options
  showXAxis = false;
  showYAxis = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = 'Date';
  showYAxisLabel = false;
  yAxisLabel = 'Heart rate';

  single: any

  /* Need to confirm */
  // colorScheme = {
  //   domain: [this.color]
  // };

  formatted = false

  formatECGData() {
    // this.colorScheme.domain = [this.color]

    if (this.graphView == true && !this.isECG) {
      this.resetAnimations()
      this.graphView = false
      return
    }
    if(this.isECG == true){
      this.single = [{ name: this.title, series: [] }]
  
        console.log(this.value);
        
        var temp = this.value.split(',');
        temp.forEach(a => {
          this.single[0].series.push({ name: a, value: +a })
  
        })
        //console.log(this.single)
        this.performAnimations()
    }
    else{
      if (this.shouldShowGraphView) {
        this.single = [{ name: this.title, series: [] }]
        console.log(this.title)
        var temp2 = this.graphData.split(',');
        temp2.forEach(a => {
          if(a!=='-'){
            this.single[0].series.push({ name: a, value: +a })
          }
          
  
        })
        //console.log(this.single)
        this.performAnimations()
      }
    }
  }

  ECGData = "-252.0,-262.0,-282.0,-304.0,-322.0,-326.0,-310.0,-274.0,-221.0,-157.0,-85.0,-7.0,77.0,170.0,267.0,363.0,448.0,515.0,560.0,584.0,588.0,575.0,548.0,509.0,461.0,403.0,335.0,258.0,176.0,97.0,27.0,-26.0,-64.0,-87.0,-103.0,-116.0,-132.0,-154.0,-178.0,-199.0,-210.0,-209.0,-194.0,-172.0,-151.0,-143.0,-149.0,-166.0,-184.0,-198.0,-206.0,-211.0,-218.0,-226.0,-235.0,-242.0,-240.0,-228.0,-202.0,-167.0,-130.0,-99.0,-80.0,-72.0,-74.0,-86.0,-104.0,-124.0,-141.0,-151.0,-150.0,-138.0,-117.0,-92.0,-68.0,-51.0,-42.0,-39.0,-38.0,-39.0,-39.0,-38.0,-35.0,-30.0,-24.0,-18.0,-14.0,-12.0,-13.0,-14.0,-14.0,-11.0,-6.0,0.0,7.0,15.0,22.0,29.0,33.0,35.0,35.0,35.0,33.0,32.0,31.0,33.0,39.0,50.0,68.0,93.0,120.0,143.0,161.0,172.0,179.0,185.0,190.0,195.0,199.0,202.0,204.0,207.0,208.0,209.0,207.0,204.0,200.0,197.0,195.0,192.0,190.0,185.0,178.0,167.0,152.0,137.0,128.0,129.0,139.0,152.0,161.0,159.0,146.0,124.0,96.0,69.0,47.0,30.0,17.0,8.0,2.0,-2.0,-5.0,-7.0,-11.0,-15.0,-23.0,-34.0,-52.0,-75.0,-101.0,-125.0,-142.0,-152.0,-156.0,-156.0,-154.0,-152.0,-152.0,-153.0,-154.0,-155.0,-153.0,-150.0,-145.0,-139.0,-129.0,-114.0,-94.0,-74.0,-61.0,-61.0,-74.0,-94.0,-114.0,-129.0,-139.0,-144.0,-145.0,-142.0,-132.0,-114.0,-88.0,-60.0,-35.0,-17.0,-6.0,0.0,3.0,1.0,-5.0,-18.0,-39.0,-64.0,-90.0,-109.0,-114.0,-104.0,-80.0,-51.0,-23.0,-4.0,6.0,9.0,8.0,4.0,0.0,-3.0,-4.0,-3.0,0.0,5.0,12.0,17.0,20.0,19.0,14.0,7.0,1.0,-3.0,-2.0,2.0,8.0,14.0,20.0,24.0,25.0,23.0,18.0,11.0,5.0,0.0,-2.0,0.0,5.0,11.0,18.0,23.0,27.0,29.0,29.0,28.0,26.0,23.0,21.0,19.0,18.0,17.0,16.0,17.0,18.0,21.0,23.0,25.0,27.0,28.0,28.0,27.0,25.0,21.0,17.0,13.0,8.0,5.0,1.0,-2.0,-4.0,-4.0,0.0,7.0,17.0,27.0,35.0,42.0,45.0,46.0,45.0,41.0,35.0,28.0,21.0,17.0,17.0,19.0,22.0,25.0,27.0,27.0,27.0,25.0,23.0,19.0,15.0,9.0,5.0,3.0,4.0,8.0,14.0,20.0,24.0,26.0,24.0,21.0,16.0,11.0,8.0,6.0,7.0,8.0,11.0,14.0,15.0,15.0,13.0,11.0,10.0,12.0,16.0,18.0,18.0,15.0,10.0,6.0,3.0,2.0,1.0,0.0,-3.0,-6.0,-7.0,-5.0,-2.0,3.0,7.0,10.0,11.0,11.0,9.0,7.0,4.0,0.0,-4.0,-8.0,-12.0,-15.0,-17.0,-18.0,-19.0,-19.0,-17.0,-15.0,-12.0,-10.0,-9.0,-9.0,-10.0,-11.0,-13.0,-15.0,-17.0,-17.0,-18.0,-18.0,-19.0,-20.0,-20.0,-20.0,-21.0,-23.0,-28.0,-33.0,-37.0,-36.0,-32.0,-26.0,-21.0,-18.0,-19.0,-22.0,-24.0,-24.0,-25.0,-26.0,-26.0,-27.0,-25.0,-22.0,-19.0,-15.0,-9.0,0.0,17.0,41.0,68.0,93.0,110.0,119.0,121.0,117.0,105.0,87.0,63.0,42.0,30.0,26.0,27.0,26.0,22.0,21.0,26.0,34.0,36.0,26.0,6.0,-17.0,-37.0,-53.0,-65.0,-74.0,-81.0,-84.0,-86.0,-87.0,-89.0,-93.0,-98.0,-101.0,-102.0,-100.0,-97.0,-97.0,-98.0,-102.0,-105.0,-107.0,-110.0,-115.0,-126.0,-143.0,-165.0,-189.0,-208.0,-219.0,-217.0,-202.0,-170.0,-120.0,-49.0,40.0,141.0,246.0,344.0,432.0,506.0,566.0,611.0,638.0,646.0,636.0,606.0,559.0,497.0,423.0,340.0,252.0,165.0,85.0,15.0,-44.0,-94.0,-139.0,-176.0,-204.0,-218.0,-219.0,-208.0,-188.0,-165.0,-147.0,-137.0,-138.0,-150.0,-171.0,-195.0,-215.0,-225.0,-224.0,-211.0,-189.0,-163.0,-140.0,-127.0,-128.0,-141.0,-164.0,-189.0,-209.0,-216.0,-207.0,-185.0,-158.0,-132.0,-115.0,-106.0,-104.0,-106.0,-113.0,-120.0,-127.0,-128.0,-123.0,-112.0,-100.0,-91.0,-85.0,-82.0,-81.0,-79.0,-77.0,-74.0,-72.0,-69.0,-66.0,-62.0,-57.0,-50.0,-42.0,-35.0,-29.0,-24.0,-20.0,-17.0,-14.0,-12.0,-11.0,-13.0,-15.0,-13.0,-4.0,16.0,45.0,76.0,102.0,118.0,122.0,117.0,104.0,87.0,73.0,70.0,82.0,105.0,132.0,157.0,175.0,189.0,197.0,200.0,200.0,196.0,192.0,187.0,183.0,181.0,181.0,185.0,188.0,190.0,188.0,180.0,168.0,154.0,142.0,137.0,139.0,146.0,153.0,157.0,157.0,151.0,137.0,116.0,90.0,66.0,47.0,33.0,22.0,13.0,4.0,-7.0,-23.0,-44.0,-70.0,-94.0,-109.0,-107.0,-89.0,-63.0,-38.0,-24.0,-23.0,-37.0,-60.0,-88.0,-113.0,-131.0,-142.0,-148.0,-150.0,-149.0,-144.0,-133.0,-114.0,-92.0,-72.0,-63.0,-68.0,-84.0,-99.0,-106.0,-101.0,-90.0,-81.0,-81.0,-91.0,-105.0,-115.0,-117.0,-109.0,-91.0,-64.0,-35.0,-9.0,7.0,14.0,13.0,10.0,6.0,3.0,2.0,2.0,5.0,10.0,16.0,22.0,27.0,29.0,30.0,29.0,26.0,22.0,16.0,10.0,1.0,-11.0,-24.0,-32.0,-30.0,-17.0,1.0,18.0,30.0,37.0,39.0,39.0,37.0,33.0,29.0,25.0,22.0,21.0,23.0,28.0,32.0,34.0,34.0,32.0,30.0,29.0,28.0,26.0,24.0,22.0,22.0,23.0,27.0,31.0,34.0,33.0,28.0,19.0,8.0,-4.0,-13.0,-15.0,-12.0,-6.0,-6.0,-17.0,-36.0,-54.0,-61.0,-54.0,-35.0,-15.0,2.0,13.0,19.0,24.0,28.0,31.0,31.0,28.0,22.0,14.0,6.0,-1.0,-4.0,-4.0,-2.0,2.0,5.0,8.0,10.0,12.0,14.0,17.0,19.0,21.0,21.0,18.0,12.0,6.0,1.0,-2.0,-2.0,-1.0,0.0,-1.0,-3.0,-9.0,-19.0,-36.0,-59.0,-82.0,-96.0,-94.0,-75.0,-45.0,-12.0,15.0,33.0,40.0,36.0,25.0,8.0,-12.0,-33.0,-52.0,-64.0,-64.0,-54.0,-38.0,-23.0,-11.0,-3.0,1.0,2.0,1.0,-1.0,-4.0,-5.0,-4.0,-2.0,3.0,8.0,11.0,11.0,6.0,0.0,-7.0,-14.0,-24.0,-38.0,-54.0,-65.0,-65.0,-54.0,-37.0,-21.0,-8.0,1.0,8.0,15.0,20.0,24.0,26.0,26.0,26.0,25.0,25.0,24.0,21.0,15.0,8.0,1.0,-4.0,-7.0,-5.0,0.0,8.0,20.0,37.0,60.0,89.0,119.0,145.0,159.0,159.0,143.0,115.0,82.0,51.0,29.0,17.0,14.0,18.0,25.0,31.0,33.0,31.0,26.0,20.0,14.0,9.0,2.0,-5.0,-12.0,-18.0,-21.0,-20.0,-16.0,-11.0,-6.0,-5.0,-6.0,-9.0,-14.0,-18.0,-20.0,-22.0,-23.0,-22.0,-22.0,-22.0,-22.0,-23.0,-25.0,-29.0,-37.0,-51.0,-71.0,-91.0,-103.0,-101.0,-86.0,-62.0,-37.0,-18.0,-8.0,-4.0,-4.0,-8.0,-11.0,-14.0,-13.0,-10.0,-6.0,-3.0,-4.0,-12.0,-27.0,-45.0,-58.0,-61.0,-52.0,-39.0,-28.0,-21.0,-18.0,-15.0,-12.0,-9.0,-6.0,-4.0,-3.0,-1.0,1.0,2.0,2.0,2.0,0.0,-1.0,-1.0,-2.0,-4.0,-7.0,-11.0,-15.0,-17.0,-18.0,-18.0,-18.0,-16.0,-13.0,-9.0,-3.0,3.0,8.0,10.0,9.0,6.0,2.0,-1.0,-4.0,-7.0,-10.0,-12.0,-10.0,-6.0,2.0,10.0,17.0,20.0,21.0,19.0,16.0,14.0,13.0,12.0,13.0,13.0,13.0,13.0,12.0,11.0,13.0,18.0,32.0,55.0,86.0,116.0,138.0,144.0,134.0,111.0,84.0,60.0,43.0,33.0,27.0,23.0,20.0,16.0,13.0,10.0,8.0,5.0,3.0,0.0,-4.0,-12.0,-24.0,-37.0,-52.0,-68.0,-84.0,-100.0,-110.0,-111.0,-103.0,-91.0,-81.0,-75.0,-73.0,-73.0,-75.0,-76.0,-76.0,-75.0,-73.0,-71.0,-69.0,-67.0,-69.0,-74.0,-85.0,-103.0,-126.0,-149.0,-163.0,-161.0,-142.0,-109.0,-65.0,-11.0,53.0,129.0,212.0,298.0,381.0,458.0,526.0,582.0,621.0,641.0,641.0,623.0,589.0,542.0,482.0,410.0,328.0,244.0,163.0,92.0,32.0,-18.0,-60.0,-99.0,-137.0,-173.0,-203.0,-222.0,-233.0,-236.0,-235.0,-232.0,-229.0,-228.0,-227.0,-228.0,-229.0,-230.0,-230.0,-231.0,-233.0,-234.0,-234.0,-234.0,-233.0,-232.0,-232.0,-233.0,-233.0,-232.0,-229.0,-226.0,-223.0,-220.0,-215.0,-208.0,-193.0,-171.0,-146.0,-123.0,-107.0,-98.0,-94.0,-93.0,-91.0,-90.0,-88.0,-88.0,-89.0,-91.0,-92.0,-92.0,-90.0,-86.0,-83.0,-80.0,-78.0,-76.0,-74.0,-71.0,-65.0,-54.0,-36.0,-14.0,11.0,30.0,37.0,36.0,33.0,39.0,55.0,78.0,100.0,116.0,125.0,129.0,131.0,134.0,138.0,142.0,146.0,149.0,152.0,156.0,162.0,169.0,178.0,186.0,190.0,192.0,190.0,186.0,182.0,179.0,177.0,177.0,178.0,181.0,185.0,188.0,189.0,187.0,184.0,180.0,176.0,172.0,168.0,162.0,153.0,138.0,118.0,95.0,75.0,60.0,51.0,43.0,36.0,28.0,18.0,7.0,-10.0,-32.0,-57.0,-78.0,-85.0,-75.0,-53.0,-30.0,-13.0,-3.0,0.0,-3.0,-12.0,-29.0,-54.0,-82.0,-108.0,-127.0,-138.0,-142.0,-142.0,-142.0,-142.0,-144.0,-148.0,-152.0,-154.0,-151.0,-140.0,-120.0,-96.0,-73.0,-54.0,-40.0,-28.0,-18.0,-10.0,-5.0,-6.0,-12.0,-26.0,-46.0,-69.0,-88.0,-100.0,-100.0,-89.0,-68.0,-44.0,-21.0,-4.0,5.0,9.0,10.0,9.0,9.0,8.0,9.0,10.0,12.0,16.0,22.0,28.0,32.0,34.0,31.0,25.0,16.0,2.0,-18.0,-42.0,-66.0,-80.0,-79.0,-62.0,-36.0,-10.0,7.0,13.0,12.0,8.0,4.0,4.0,7.0,12.0,18.0,23.0,24.0,20.0,14.0,7.0,3.0,0.0,-1.0,-1.0,0.0,2.0,4.0,6.0,8.0,10.0,12.0,13.0,15.0,15.0,14.0,12.0,10.0,10.0,13.0,17.0,20.0,20.0,15.0,6.0,-6.0,-19.0,-31.0,-37.0,-36.0,-31.0,-24.0,-18.0,-11.0,-5.0,2.0,10.0,17.0,23.0,29.0,33.0,34.0,31.0,25.0,17.0,8.0,2.0,0.0,2.0,6.0,11.0,15.0,18.0,20.0,21.0,21.0,20.0,18.0,14.0,9.0,3.0,-3.0,-8.0,-10.0,-8.0,-2.0,5.0,13.0,19.0,24.0,25.0,23.0,18.0,13.0,9.0,6.0,6.0,6.0,7.0,8.0,9.0,12.0,17.0,22.0,27.0,30.0,31.0,30.0,26.0,21.0,17.0,14.0,15.0,20.0,32.0,51.0,77.0,104.0,128.0,145.0,153.0,153.0,146.0,133.0,113.0,88.0,59.0,31.0,9.0,-7.0,-17.0,-23.0,-26.0,-30.0,-36.0,-43.0,-50.0,-54.0,-55.0,-54.0,-53.0,-53.0,-56.0,-61.0,-67.0,-76.0,-89.0,-107.0,-132.0,-162.0,-191.0,-214.0,-227.0,-229.0,-221.0,-204.0,-184.0,-165.0,-151.0,-142.0,-137.0,-134.0,-134.0,-137.0,-144.0,-156.0,-171.0,-188.0,-200.0,-202.0,-192.0,-176.0,-155.0,-128.0,-88.0,-30.0,47.0,138.0,235.0,329.0,412.0,481.0,531.0,558.0,563.0,548.0,517.0,477.0,430.0,376.0,314.0,244.0,171.0,101.0,41.0,-5.0,-38.0,-66.0,-96.0,-127.0,-157.0,-177.0,-180.0,-166.0,-139.0,-111.0,-90.0,-85.0,-96.0,-117.0,-139.0,-158.0,-170.0,-176.0,-176.0,-171.0,-161.0,-147.0,-130.0,-111.0,-87.0,-58.0,-26.0,4.0,23.0,27.0,15.0,-5.0,-24.0,-37.0,-42.0,-43.0,-40.0,-34.0,-23.0,-5.0,19.0,45.0,69.0,88.0,100.0,108.0,114.0,118.0,120.0,118.0,108.0,87.0,56.0,17.0,-21.0,-49.0,-59.0,-52.0,-34.0,-16.0,-6.0,-4.0,-10.0,-18.0,-26.0,-31.0,-32.0,-29.0,-21.0,-8.0,8.0,23.0,29.0,21.0,5.0,-12.0,-23.0"
  ECGData2 = "0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0"
  ECGData3 = "-183.0,-185.0,-188.0,-194.0,-198.0,-197.0,-190.0,-173.0,-147.0,-114.0,-75.0,-30.0,21.0,82.0,152.0,225.0,295.0,353.0,394.0,416.0,418.0,404.0,376.0,338.0,292.0,240.0,186.0,132.0,82.0,36.0,-2.0,-32.0,-55.0,-71.0,-82.0,-88.0,-93.0,-98.0,-103.0,-108.0,-111.0,-109.0,-103.0,-96.0,-89.0,-87.0,-88.0,-92.0,-96.0,-99.0,-101.0,-104.0,-110.0,-119.0,-129.0,-136.0,-138.0,-132.0,-119.0,-102.0,-85.0,-72.0,-64.0,-60.0,-59.0,-60.0,-61.0,-62.0,-62.0,-62.0,-62.0,-59.0,-55.0,-50.0,-44.0,-40.0,-37.0,-37.0,-37.0,-38.0,-38.0,-38.0,-35.0,-30.0,-24.0,-19.0,-14.0,-13.0,-13.0,-15.0,-14.0,-12.0,-7.0,-1.0,6.0,14.0,21.0,28.0,32.0,34.0,34.0,33.0,32.0,30.0,29.0,30.0,33.0,38.0,44.0,51.0,58.0,64.0,69.0,74.0,78.0,83.0,89.0,93.0,97.0,100.0,102.0,105.0,106.0,106.0,105.0,102.0,98.0,95.0,92.0,90.0,87.0,84.0,79.0,74.0,68.0,65.0,63.0,64.0,67.0,69.0,71.0,70.0,67.0,61.0,53.0,44.0,34.0,23.0,13.0,5.0,-1.0,-5.0,-8.0,-11.0,-14.0,-17.0,-22.0,-27.0,-33.0,-39.0,-45.0,-51.0,-57.0,-60.0,-61.0,-60.0,-58.0,-56.0,-56.0,-57.0,-59.0,-59.0,-58.0,-55.0,-51.0,-48.0,-44.0,-41.0,-38.0,-35.0,-34.0,-34.0,-36.0,-39.0,-43.0,-46.0,-49.0,-51.0,-53.0,-52.0,-49.0,-43.0,-35.0,-27.0,-20.0,-14.0,-9.0,-6.0,-4.0,-5.0,-9.0,-16.0,-24.0,-32.0,-39.0,-44.0,-44.0,-39.0,-30.0,-20.0,-10.0,-3.0,1.0,1.0,-2.0,-6.0,-10.0,-13.0,-14.0,-13.0,-10.0,-4.0,2.0,7.0,10.0,8.0,3.0,-4.0,-10.0,-14.0,-13.0,-9.0,-4.0,3.0,9.0,13.0,14.0,11.0,6.0,-1.0,-7.0,-12.0,-14.0,-12.0,-7.0,-1.0,6.0,11.0,14.0,16.0,17.0,16.0,13.0,11.0,8.0,7.0,5.0,4.0,4.0,4.0,6.0,8.0,10.0,12.0,14.0,16.0,16.0,15.0,12.0,9.0,5.0,0.0,-4.0,-7.0,-11.0,-14.0,-16.0,-16.0,-12.0,-5.0,5.0,15.0,24.0,30.0,33.0,34.0,33.0,30.0,24.0,17.0,10.0,6.0,6.0,8.0,12.0,15.0,16.0,17.0,16.0,15.0,13.0,10.0,5.0,0.0,-4.0,-6.0,-5.0,-1.0,5.0,11.0,16.0,18.0,16.0,13.0,9.0,4.0,1.0,-1.0,0.0,2.0,5.0,8.0,10.0,9.0,8.0,6.0,5.0,8.0,12.0,14.0,14.0,11.0,7.0,3.0,1.0,0.0,-1.0,-2.0,-5.0,-7.0,-8.0,-6.0,-2.0,3.0,7.0,10.0,12.0,12.0,11.0,9.0,6.0,3.0,-2.0,-5.0,-9.0,-11.0,-13.0,-14.0,-14.0,-14.0,-12.0,-10.0,-7.0,-4.0,-2.0,-2.0,-2.0,-4.0,-6.0,-7.0,-8.0,-9.0,-9.0,-9.0,-9.0,-10.0,-9.0,-9.0,-9.0,-12.0,-16.0,-21.0,-24.0,-23.0,-19.0,-12.0,-7.0,-4.0,-5.0,-7.0,-8.0,-9.0,-9.0,-10.0,-10.0,-10.0,-8.0,-5.0,-1.0,2.0,5.0,8.0,13.0,20.0,28.0,35.0,40.0,43.0,44.0,42.0,37.0,29.0,21.0,15.0,11.0,9.0,7.0,6.0,5.0,4.0,5.0,5.0,4.0,0.0,-6.0,-13.0,-22.0,-31.0,-41.0,-49.0,-55.0,-58.0,-60.0,-61.0,-63.0,-66.0,-71.0,-74.0,-74.0,-72.0,-69.0,-68.0,-70.0,-73.0,-75.0,-77.0,-79.0,-82.0,-86.0,-91.0,-96.0,-100.0,-103.0,-104.0,-102.0,-97.0,-86.0,-64.0,-30.0,17.0,75.0,139.0,207.0,276.0,341.0,398.0,441.0,468.0,476.0,466.0,437.0,391.0,332.0,266.0,198.0,134.0,80.0,35.0,-1.0,-30.0,-53.0,-73.0,-88.0,-98.0,-102.0,-103.0,-102.0,-99.0,-96.0,-94.0,-93.0,-95.0,-98.0,-102.0,-106.0,-110.0,-111.0,-110.0,-107.0,-101.0,-95.0,-89.0,-86.0,-86.0,-90.0,-97.0,-104.0,-109.0,-111.0,-107.0,-100.0,-92.0,-84.0,-79.0,-76.0,-77.0,-79.0,-82.0,-84.0,-86.0,-85.0,-82.0,-77.0,-71.0,-65.0,-62.0,-60.0,-59.0,-58.0,-56.0,-53.0,-51.0,-49.0,-47.0,-43.0,-38.0,-31.0,-24.0,-17.0,-11.0,-6.0,-3.0,0.0,3.0,5.0,5.0,2.0,-1.0,-2.0,1.0,8.0,19.0,30.0,38.0,42.0,42.0,40.0,37.0,34.0,33.0,36.0,41.0,51.0,63.0,76.0,88.0,98.0,105.0,108.0,107.0,103.0,98.0,93.0,89.0,86.0,87.0,89.0,93.0,94.0,92.0,86.0,77.0,69.0,62.0,59.0,58.0,59.0,61.0,62.0,62.0,61.0,59.0,55.0,49.0,42.0,34.0,26.0,19.0,10.0,2.0,-7.0,-17.0,-26.0,-36.0,-43.0,-47.0,-45.0,-39.0,-30.0,-21.0,-16.0,-16.0,-20.0,-27.0,-36.0,-44.0,-50.0,-55.0,-58.0,-59.0,-59.0,-57.0,-53.0,-46.0,-39.0,-32.0,-29.0,-30.0,-33.0,-36.0,-37.0,-36.0,-33.0,-31.0,-32.0,-34.0,-37.0,-39.0,-38.0,-34.0,-28.0,-18.0,-9.0,-1.0,3.0,3.0,0.0,-5.0,-9.0,-12.0,-13.0,-13.0,-11.0,-6.0,0.0,6.0,11.0,13.0,14.0,13.0,10.0,5.0,1.0,-3.0,-7.0,-9.0,-11.0,-11.0,-9.0,-4.0,4.0,11.0,17.0,21.0,23.0,22.0,20.0,17.0,12.0,8.0,5.0,4.0,7.0,11.0,15.0,17.0,17.0,16.0,14.0,12.0,11.0,10.0,8.0,6.0,6.0,8.0,12.0,16.0,18.0,17.0,13.0,6.0,-1.0,-7.0,-10.0,-10.0,-8.0,-5.0,-4.0,-7.0,-13.0,-18.0,-20.0,-18.0,-13.0,-7.0,-2.0,3.0,7.0,11.0,15.0,18.0,19.0,16.0,10.0,2.0,-6.0,-12.0,-15.0,-15.0,-12.0,-9.0,-5.0,-2.0,0.0,2.0,4.0,7.0,10.0,11.0,11.0,9.0,4.0,-2.0,-7.0,-10.0,-10.0,-9.0,-8.0,-8.0,-10.0,-12.0,-16.0,-21.0,-27.0,-32.0,-35.0,-33.0,-25.0,-12.0,5.0,20.0,32.0,36.0,32.0,21.0,7.0,-7.0,-18.0,-26.0,-30.0,-30.0,-28.0,-23.0,-17.0,-11.0,-5.0,-2.0,-1.0,-2.0,-4.0,-6.0,-7.0,-6.0,-3.0,1.0,7.0,10.0,9.0,5.0,-1.0,-7.0,-12.0,-16.0,-20.0,-25.0,-28.0,-28.0,-25.0,-19.0,-12.0,-5.0,2.0,9.0,15.0,21.0,24.0,26.0,26.0,26.0,26.0,26.0,25.0,22.0,16.0,9.0,2.0,-3.0,-6.0,-4.0,0.0,8.0,18.0,28.0,39.0,50.0,61.0,70.0,75.0,74.0,68.0,57.0,43.0,30.0,20.0,14.0,14.0,19.0,26.0,32.0,34.0,32.0,27.0,21.0,15.0,9.0,3.0,-4.0,-11.0,-17.0,-20.0,-19.0,-15.0,-10.0,-6.0,-4.0,-6.0,-9.0,-14.0,-18.0,-20.0,-22.0,-23.0,-22.0,-21.0,-21.0,-22.0,-23.0,-24.0,-25.0,-27.0,-30.0,-33.0,-35.0,-36.0,-35.0,-31.0,-24.0,-16.0,-10.0,-5.0,-4.0,-5.0,-9.0,-13.0,-15.0,-15.0,-12.0,-8.0,-4.0,-3.0,-5.0,-11.0,-18.0,-23.0,-25.0,-25.0,-23.0,-21.0,-20.0,-19.0,-17.0,-15.0,-12.0,-9.0,-7.0,-6.0,-4.0,-2.0,-1.0,-1.0,-2.0,-3.0,-4.0,-4.0,-5.0,-7.0,-10.0,-14.0,-18.0,-20.0,-21.0,-21.0,-20.0,-18.0,-15.0,-11.0,-6.0,0.0,5.0,7.0,6.0,3.0,-1.0,-4.0,-7.0,-10.0,-13.0,-14.0,-13.0,-8.0,-1.0,7.0,14.0,18.0,19.0,17.0,14.0,12.0,11.0,11.0,11.0,11.0,12.0,12.0,11.0,10.0,11.0,14.0,21.0,32.0,46.0,58.0,65.0,66.0,61.0,53.0,45.0,39.0,34.0,30.0,27.0,24.0,21.0,18.0,15.0,13.0,10.0,8.0,6.0,4.0,-1.0,-9.0,-20.0,-32.0,-44.0,-54.0,-61.0,-65.0,-67.0,-68.0,-67.0,-67.0,-66.0,-65.0,-65.0,-66.0,-67.0,-68.0,-69.0,-68.0,-65.0,-62.0,-60.0,-58.0,-59.0,-61.0,-66.0,-71.0,-77.0,-82.0,-85.0,-84.0,-76.0,-63.0,-43.0,-16.0,18.0,60.0,107.0,161.0,221.0,283.0,344.0,397.0,436.0,456.0,456.0,438.0,405.0,361.0,309.0,251.0,191.0,133.0,82.0,40.0,6.0,-21.0,-43.0,-64.0,-82.0,-97.0,-108.0,-116.0,-119.0,-119.0,-117.0,-114.0,-112.0,-110.0,-109.0,-110.0,-111.0,-111.0,-112.0,-113.0,-114.0,-115.0,-116.0,-115.0,-114.0,-114.0,-114.0,-114.0,-114.0,-113.0,-110.0,-107.0,-104.0,-102.0,-100.0,-99.0,-96.0,-92.0,-87.0,-81.0,-77.0,-75.0,-74.0,-73.0,-73.0,-71.0,-70.0,-70.0,-71.0,-73.0,-74.0,-74.0,-72.0,-69.0,-65.0,-62.0,-60.0,-59.0,-58.0,-55.0,-49.0,-41.0,-30.0,-16.0,-3.0,7.0,14.0,17.0,19.0,22.0,26.0,31.0,36.0,40.0,42.0,43.0,44.0,47.0,50.0,54.0,58.0,61.0,63.0,67.0,72.0,80.0,88.0,95.0,100.0,101.0,98.0,94.0,90.0,87.0,85.0,84.0,85.0,88.0,91.0,94.0,94.0,92.0,89.0,85.0,81.0,77.0,73.0,70.0,66.0,63.0,60.0,57.0,54.0,51.0,48.0,43.0,36.0,28.0,19.0,10.0,0.0,-12.0,-23.0,-30.0,-32.0,-28.0,-20.0,-12.0,-6.0,-3.0,-2.0,-3.0,-5.0,-11.0,-18.0,-27.0,-36.0,-43.0,-48.0,-49.0,-49.0,-49.0,-49.0,-51.0,-55.0,-60.0,-63.0,-63.0,-58.0,-49.0,-39.0,-30.0,-24.0,-19.0,-17.0,-14.0,-13.0,-12.0,-11.0,-12.0,-14.0,-17.0,-20.0,-23.0,-25.0,-25.0,-24.0,-20.0,-15.0,-10.0,-5.0,-2.0,-1.0,-1.0,-2.0,-3.0,-4.0,-3.0,-2.0,0.0,4.0,10.0,16.0,20.0,21.0,19.0,14.0,7.0,0.0,-8.0,-16.0,-22.0,-26.0,-25.0,-19.0,-10.0,-1.0,4.0,4.0,0.0,-5.0,-8.0,-9.0,-6.0,0.0,6.0,10.0,11.0,8.0,2.0,-5.0,-9.0,-11.0,-12.0,-11.0,-11.0,-9.0,-7.0,-5.0,-3.0,-2.0,0.0,1.0,3.0,3.0,2.0,0.0,-2.0,-1.0,1.0,5.0,9.0,9.0,5.0,-2.0,-10.0,-18.0,-24.0,-28.0,-29.0,-29.0,-28.0,-25.0,-21.0,-15.0,-8.0,0.0,7.0,14.0,20.0,24.0,25.0,22.0,16.0,8.0,0.0,-6.0,-8.0,-6.0,-2.0,3.0,7.0,10.0,13.0,14.0,14.0,13.0,11.0,8.0,3.0,-3.0,-9.0,-13.0,-15.0,-12.0,-7.0,1.0,9.0,16.0,21.0,22.0,20.0,16.0,11.0,7.0,5.0,5.0,6.0,7.0,8.0,10.0,14.0,19.0,25.0,30.0,33.0,35.0,34.0,31.0,27.0,23.0,20.0,21.0,24.0,30.0,38.0,47.0,55.0,63.0,68.0,70.0,69.0,65.0,59.0,52.0,44.0,35.0,26.0,17.0,8.0,2.0,-2.0,-5.0,-8.0,-13.0,-20.0,-25.0,-29.0,-29.0,-27.0,-25.0,-25.0,-27.0,-31.0,-37.0,-44.0,-53.0,-65.0,-77.0,-88.0,-97.0,-103.0,-106.0,-108.0,-108.0,-108.0,-107.0,-105.0,-103.0,-100.0,-97.0,-95.0,-95.0,-98.0,-102.0,-108.0,-114.0,-120.0,-124.0,-126.0,-125.0,-121.0,-112.0,-98.0,-76.0,-44.0,0.0,55.0,120.0,189.0,257.0,317.0,363.0,389.0,392.0,376.0,345.0,304.0,258.0,210.0,161.0,114.0,71.0,34.0,5.0,-17.0,-35.0,-52.0,-68.0,-83.0,-95.0,-102.0,-102.0,-96.0,-86.0,-75.0,-68.0,-65.0,-67.0,-73.0,-82.0,-90.0,-98.0,-104.0,-105.0,-102.0,-95.0,-84.0,-70.0,-55.0,-40.0,-25.0,-11.0,-1.0,6.0,7.0,5.0,1.0,-3.0,-5.0,-5.0,-4.0,-2.0,1.0,5.0,11.0,17.0,24.0,30.0,37.0,44.0,51.0,57.0,62.0,66.0,67.0,62.0,50.0,33.0,14.0,-4.0,-17.0,-23.0,-23.0,-19.0,-14.0,-11.0,-11.0,-15.0,-20.0,-23.0,-24.0,-22.0,-17.0,-12.0,-6.0,0.0,5.0,8.0,8.0,7.0,5.0,4.0"

  riskInfoAlert(title){
    if(title == 'Fat Ratio'){
      this._constant.riskInfoTitle = "You got a free diet consultation.";
      this._constant.riskInfoSubTitle = "Click yes to avail free diet consultation to reduce your fat";
    }

    if(title == 'BMI'){
      this._constant.riskInfoTitle = "You got a free diet consultation.";
      this._constant.riskInfoSubTitle = "Click yes to avail free diet consultation to reduce your weight";
    }

    if(title == 'WEIGHT'){
      this._constant.riskInfoTitle = "You got a free diet consultation.";
      this._constant.riskInfoSubTitle = "Click yes to avail free diet consultation to reduce your weight";
    }

    if(title == 'PULSE'){
      this._constant.riskInfoTitle = "We recommend you for a online doctor consultation";
      this._constant.riskInfoSubTitle = "Click yes to consult a doctor";
    }

    if(title == 'Blood Pressure'){
      this._constant.riskInfoTitle = "We recommend you for a online doctor consultation";
      this._constant.riskInfoSubTitle = "Click yes to consult a doctor";
    }

    if(title == 'ECG'){
      this._constant.riskInfoTitle = "We recommend you for a online doctor consultation";
      this._constant.riskInfoSubTitle = "Click yes to consult a doctor";
    }

    if(title == 'TEMPERATURE'){
      this._constant.riskInfoTitle = "We recommend you for a online doctor consultation";
      this._constant.riskInfoSubTitle = "Click yes to consult a doctor";
    }

    if(title == 'SpO2'){
      this._constant.riskInfoTitle = "We recommend you for a online doctor consultation";
      this._constant.riskInfoSubTitle = "Click yes to consult a doctor";
    }

    if(title == 'Protein'){
      this._constant.riskInfoTitle = "We recommend you for a online doctor consultation";
      this._constant.riskInfoSubTitle = "Click yes to consult a doctor";
    }

    if(title == 'Extra Cellular Water'){
      this._constant.riskInfoTitle = "We recommend you for a online doctor consultation";
      this._constant.riskInfoSubTitle = "Click yes to consult a doctor";
    }

    if(title == 'Intra Cellular Water'){
      this._constant.riskInfoTitle = "We recommend you for a online doctor consultation";
      this._constant.riskInfoSubTitle = "Click yes to consult a doctor";
    }

    if(title == 'Mineral'){
      this._constant.riskInfoTitle = "We recommend you for a online doctor consultation";
      this._constant.riskInfoSubTitle = "Click yes to consult a doctor";
    }

    if(title == 'Skeletal Muscle Mass'){
      this._constant.riskInfoTitle = "We recommend you for a online doctor consultation";
      this._constant.riskInfoSubTitle = "Click yes to consult a doctor";
    }

    if(title == 'Body Fat Mass'){
      this._constant.riskInfoTitle = "We recommend you for a online doctor consultation";
      this._constant.riskInfoSubTitle = "Click yes to consult a doctor";
    }

    if(title == 'Waist/Hip Ratio'){
      this._constant.riskInfoTitle = "We recommend you for a online doctor consultation";
      this._constant.riskInfoSubTitle = "Click yes to consult a doctor";
    }

    if(title == 'Body Cell Mass'){
      this._constant.riskInfoTitle = "We recommend you for a online doctor consultation";
      this._constant.riskInfoSubTitle = "Click yes to consult a doctor";
    }

    if(title == 'waist/Height Ratio'){
      this._constant.riskInfoTitle = "We recommend you for a online doctor consultation";
      this._constant.riskInfoSubTitle = "Click yes to consult a doctor";
    }

    if(title == 'Visceral Fat'){
      this._constant.riskInfoTitle = "We recommend you for a online doctor consultation";
      this._constant.riskInfoSubTitle = "Click yes to consult a doctor";
    }

    if(title == 'Basal Metabolic Rate'){
      this._constant.riskInfoTitle = "We recommend you for a online doctor consultation";
      this._constant.riskInfoSubTitle = "Click yes to consult a doctor";
    }

    if(title == 'Bone Mineral Content'){
      this._constant.riskInfoTitle = "We recommend you for a online doctor consultation";
      this._constant.riskInfoSubTitle = "Click yes to consult a doctor";
    }

    if(title == 'Percent Body Fat'){
      this._constant.riskInfoTitle = "We recommend you for a online doctor consultation";
      this._constant.riskInfoSubTitle = "Click yes to consult a doctor";
    }

    //var title = title.toLowerCase();
    this._constant.riskInfoAlerts = true;
    
    this.dialog.open(ModalComponent);
  }
}
