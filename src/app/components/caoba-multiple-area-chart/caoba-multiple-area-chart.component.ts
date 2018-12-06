import { Component, OnInit, Input } from '@angular/core';
import { TestServiceService } from "../../services/test-service/test-service.service";

import * as d3 from 'd3';
import * as crossfilter from 'crossfilter2';

@Component({
  selector: 'caoba-multiple-area-chart',
  templateUrl: './caoba-multiple-area-chart.component.html',
  styleUrls: ['./caoba-multiple-area-chart.component.css']
})
export class CaobaMultipleAreaChartComponent implements OnInit {

  private data: any;
  private chartId = 'multiple-area-chart-1';

  @Input() width = 200; 
  @Input() height = 200;
  @Input() xlabel = 'Año';
  @Input() ylabel = 'Recaudo';

  private svg;
  private g;
  private margin = { top: 20, right: 20, bottom: 30, left: 50 };
  private iwidth;
  private iheight;
  private colorScale;
  private xScale
  private yScale;
  private series;


  constructor(private svc: TestServiceService) { }

  ngOnInit() {
    
    this.svc.getData().subscribe(data => {
      this.data = data;

      this.drawChart();
    });

  }

  drawChart() {

    this.svg = d3.select( "svg" )
      .attr( "width", this.width )
      .attr( "height", this.height );
    
    this.iwidth = this.width - this.margin.left - this.margin.right;
    this.iheight = this.height - this.margin.top - this.margin.bottom;

    this.g = this.svg.append( "g" )
      .attr( "transform", "translate(" + this.margin.left + "," + this.margin.top + ")" );

    // Function to extract keys from json array
    var getKeys = function( arr ) {
      var key, keys = [];
      for( var i = 0; i < arr.length; i++ ) {
        for( key in arr[ i ] ) {
          if( keys.indexOf( key ) === -1 ) {
            keys.push(key);
          }
        }
      }
      return keys;
    };

    this.series = getKeys( this.data ).slice( 1 );

    this.drawScales();
    this.drawSeries();

  }

  private drawScales() {

    /* Defining scales */

    this.colorScale = d3.scaleOrdinal( d3.schemeCategory20 )
      .domain( this.series );

    this.xScale = d3.scaleLinear()
      .domain( [ d3.min( this.data, d => d[ "year" ] ), d3.max( this.data, d => d[ "year" ] ) ] )
      .range( [ 0, this.iwidth ] );

    this.yScale = d3.scaleLinear()
      .domain( [ 0, d3.max( this.data, d => d[ "series1" ] ) ] ) //// NO SOPORTA AÚN MULTISERIE
      .range( [ this.iheight, 0 ] );

    var xAxis = d3.axisBottom( this.xScale ).ticks( this.data.length, "d" );
    var yAxis = d3.axisLeft( this.yScale ).ticks( 5, "s" );

    /* Drawing grid */

    var xGrid = this.g.append( "g" )     
      .attr( "class", "grid" )
      .attr( "transform", "translate(0," + this.iheight + ")" )
      .call( d3.axisBottom( this.xScale ).tickSize( -this.iheight ).tickFormat( "" ) );

    xGrid.selectAll( "line" )
      .style( "stroke", "lightgrey" )
      .style( "stroke-opacity", .7 )
      .style( "shape-rendering", "crispEdges" );

    xGrid.selectAll( "path" )
      .style( "stroke-width", 0 );

    var yGrid = this.g.append( "g" )     
      .attr( "class", "grid" )
      .call( d3.axisLeft( this.yScale ).tickSize( -this.iwidth ).tickFormat( "" ) );

    yGrid.selectAll( "line" )
      .style( "stroke", "lightgrey" )
      .style( "stroke-opacity", .7 )
      .style( "shape-rendering", "crispEdges" );

     yGrid.selectAll( "path" )
      .style( "stroke-width", 0 );

    /* Drawing scales */

    this.g.append( "g" )
      .attr( "class", "axis x-axis" )
      .attr( "transform", "translate(0," + this.iheight + ")" )
      .call( xAxis )
      .append( "text" )
        .attr( "y", -12 )
        .attr( "x", this.iwidth - 10 )
        .attr( "dy", "0.71em" )
        .attr( "fill", "#000" )
        .text( this.xlabel );

    this.g.append( "g" )
      .attr( "class", "axis y-axis" )
      .call( yAxis )
      .append( "text" )
        .attr( "transform", "rotate(-90)" )
        .attr( "y", 6 )
        .attr( "dy", "0.71em" )
        .attr( "fill", "#000" )
        .text( this.ylabel );

  }

  private drawSeries() {

    /* Drawing series */

    this.series.forEach( serie => {

      console.log( serie );

      var line = d3.line()
        .x( d => this.xScale( d[ "year" ] ) )
        .y( d => this.yScale( d[ serie ] ) ) 
        .curve( d3.curveMonotoneX );

      var area = d3.area()
        .x( d => this.xScale( d[ "year" ] ) )
        .y0( this.yScale( 0 ) )
        .y1( d => this.yScale( d[ serie ] ) )
        .curve( d3.curveMonotoneX );

      this.g.append( "path" )
        .datum( this.data )
        .attr( "d", area )
        .style( "fill-opacity", .2 )
        .style( "fill", this.colorScale( serie ) );

      this.g.append( "path" )
        .datum( this.data )
        .attr( "d", line )
        .style( "fill", "none" )
        .style( "stroke", this.colorScale( serie ) )
        .style( "stroke-width", 3 );

      this.g.selectAll( "circle." + serie )
        .data( this.data )
        .enter()
        .append( "circle" )
          .attr( "class", serie )
          .attr( "cx", d => this.xScale( d[ "year" ] ) )
          .attr( "cy", d => this.yScale( d[ serie ] ) )
          .attr( "r", 5 )
          .style( "fill", this.colorScale( serie ) )
          .append( "title" )
            .text( d => d[ serie ] );

    } );

  }

}