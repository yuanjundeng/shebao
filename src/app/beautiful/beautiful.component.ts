import { Component, OnInit } from '@angular/core';
import "../data/CityData"
import { dataList,dataMap } from '../data/CityData';

@Component({
  selector: 'app-beautiful',
  templateUrl: './beautiful.component.html',
  styleUrls: ['./beautiful.component.scss']
})
export class BeautifulComponent implements OnInit {
  //省市对应表
  dataList=dataList;
  //每个地区的社保标准
  dataMap=dataMap;
  //省index
  currProvinceIndex=8;
  //市index
  currCityIndex=0;

  //当前省份（默认上海市）
  currProvince=dataList[8];
  //当前城市（默认上海市）
  currCity=dataList[8].children[0];
  //当前城市的社保与公积金标准
  currCityStandard=dataMap[310001];

  //当前输入的社保基数
  currInputInsure:number=this.currCityStandard.insure[0].minBase;
  //当前输入的公积金基数
  currInputFund:number=this.currCityStandard.fund[0].minBase;
  //个人应交社保总额
  userInsureTotal:number=0;
   //公司应交社保总额
  companyInsureTotal:number=0;
  //个人应交公积金总额
  userFundTotal:number=0;
  //公司应交公积金总额
  companyFundTotal:number=0;


  constructor() { }

  ngOnInit(): void {
    // let str="name";
    // console.log(this.dataList);
    // let person=new Person("我的名字");
    // console.log(Object.getOwnPropertyDescriptor(person,str)?.value);
  }
  /**
   * 选择省份
   * @param event
   */
  provinceChange(event:any){
    //省份改变了，默认选中该省的第一个城市
    this.currCityIndex=0;
    //
    this.currProvince=dataList[this.currProvinceIndex];
    this.currCity=this.currProvince.children[this.currCityIndex];
    console.log("currProvince:"+this.currProvince.name+"  "+this.currProvince.code);
    console.log("currCity:"+JSON.stringify(this.currCity));
    //更新城市的社保标准
    this.currCityStandard=Object.getOwnPropertyDescriptor(this.dataMap,this.currCity.code)?.value;
    console.log(JSON.stringify(this.currCityStandard));
    //重置默认社保公积金基数
    this.currInputInsure=this.currCityStandard.insure[0].minBase;
    this.currInputFund=this.currCityStandard.fund[0].minBase;
  }
  /**
   * 选择城市
   */
  cityChange(){
    this.currCity=this.currProvince.children[this.currCityIndex];
    console.log("currCity:"+JSON.stringify(this.currCity));
    //更新城市的社保标准
    this.currCityStandard=Object.getOwnPropertyDescriptor(this.dataMap,this.currCity.code)?.value;
    console.log(JSON.stringify(this.currCityStandard));
    //重置默认社保公积金基数
    this.currInputInsure=this.currCityStandard.insure[0].minBase;
    this.currInputFund=this.currCityStandard.fund[0].minBase;
  }
  /**
   * 社保单项
   *
   * @param item
   * @param index
   * @returns
   */
  getInsureConfig(item:Item,index:number):number{
    var cTotal = 0;
    var uTotal = 0;
    var bothTotal = 0;
    //
    var cBase = this.currInputInsure;
    var uBase = this.currInputInsure;
    cBase = Math.max(cBase,item['cMin']);
    cBase = Math.min(cBase,item['cMax']);
    uBase = Math.max(uBase,item['uMin']);
    uBase = Math.min(uBase,item['uMax']);
    var cValue = cBase*item['cRatio'];
    var uValue = uBase*item['uRatio'];
    var bothValue = cValue+uValue;
    cTotal += cValue;
    uTotal += uValue;
    bothTotal += bothValue;
    //
    let result=0;
    switch(index){
      case 1:
        result=uBase;
        break;
      case 2:
        result=uValue;
        break;
      case 3:
        result=cBase;
        break;
      case 4:
        result=cValue;
        break;
      case 5:
        result=bothValue;
        break;
    }
    return result;
  }
  /**
   *个人社保or公积金总额
   *
   * @memberof BeautifulComponent
   */
  getInsureUserTotal(items:Item[],isInsure:boolean):number{
    let total=0;
    for(let item of items){
      total+=this.getInsureConfig(item,2);
    }
    if(isInsure){
      this.userInsureTotal=total;
    }else{
      this.userFundTotal=total;
    }
    return total;
  }
  /**
   *公司社保or公积金总额
   *
   * @memberof BeautifulComponent
   */
   getInsureCompanyTotal(items:Item[],isInsure:boolean):number{
    let total=0;
    for(let item of items){
      total+=this.getInsureConfig(item,4);
    }
    if(isInsure){
      this.companyInsureTotal=total;
    }else{
      this.companyFundTotal=total;
    }
    return total;
  }
}



class Person{
  name:string
  constructor(name:string){
    this.name=name;
  }
}
/**
 * 单个社保配置项的数据模型
 */
export interface Item{
  name:string;
  cMax:number;
  cMin:number;
  cRatio:number;
  cConstant:number;
  uMax:number;
  uMin:number;
  uRatio:number;
  uConstant:number;
}


