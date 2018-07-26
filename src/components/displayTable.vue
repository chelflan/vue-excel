<template>
  <div class="m-excel-area">
      <h1>Excel</h1>
   <div class="container">
    <div class="table-content">
      <div class="table-tr">
        <div class="table-td-title-1"><input v-model="showPos" readonly/></div>
        <div class="table-td-title-2"><input v-model="showVal"  style="width:100%" @keyup = "keyupFun"/></div>
      </div>
    </div>
   <div class="table-content" id="table-content"  style="position:relative;" >
     
     <!-- 表头 -->
    <div   style="position:relative;z-index:5;" class="table-thead">
		<div class="table-tr">
			<div class="table-th"></div>
			<div class="table-th" v-for="th in getAlphabetArr()" :key="th" :class="th">{{th}}</div>
		</div>
    </div>
    <!-- 内容 -->
		<div  style="position:relative;z-index:5;" class="table-tr" v-for="tr in getTotalRow()" :key="tr">
			<div class="table-td">{{tr}}</div>
			<div class="table-td table-cell" v-for="td in getAlphabetArr()" :key="td" contenteditable="true" @click="clk" @focus="focusCell(tr,td)" @keyup="divKeyUp">
            {{isOk(tr,td)}}
      </div>
    </div>
     <span class = "select-wrap" style="position: absolute;min-width:100px;z-index:9;">
        <div class="table-input-content" tabindex="0" contenteditable="true" dir="ltr" aria-autocomplete="list" aria-label="F12" style="max-height: 374px; min-height: 19px;border:1px solid #000;background:#DBF2F5">
          {{showVal}}
          </div>
      </span>
	</div>
</div>
<!-- sheets -->
<div class="g-tabs">
        <div class="table-td" v-for="n in tableData.sheetsNames" :key="n"  :label="n" @click="changeSheet(n)">{{n}}</div>
</div>

  </div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      loading: true,
      showPos: "",
      showVal: "",
      currentDataSheet:"",
      tableData: {
        sheetsNames: ["sheet1", "sheet2","sheet3"],
        sheets: {
          sheet1: {
            Meta: { A: { w: 300 } },
            Data: {
              A1: "22",
              A2: "3",
              A3: "=SUM(A1:A2)",
              A200: 33,
              B1: "888",
              G60: 123242444334
            }
          },
          sheet2: {
            Meta: { A: { w: 300 } },
            Data: {
              A1: "1",
              B1: "2",
              A2: "3",
              B2: "6",
              A3: "=SUM(A1:A2:B2)",
              A200: 33,
              G60: 123242444334
            }
          },
          sheet3: {
            Meta: { A: { w: 300 } },
            Data: {
              A1: "1",
              B1: "2",
              A2: "3",
              B2: "6",
              A3: "=SUM(sheet1!A1:A2:B1,sheet2!A2,A2:B2)"
            }
          }
        }
      }
    };
  },
  mounted() {},
  created() {
    let sheetsAll = this.tableData.sheets;
    let sheetsNames = this.tableData.sheetsNames;
    this.currentDataSheet = sheetsAll[sheetsNames[0]];
  },
  watch: {},
  methods: {
    divKeyUp(e){
      
      // this.currentDataSheet.Data[this.showPos] = this.showVal;
    },
    //点击当前表格
    changeSheet(name) {
      this.currentDataSheet = this.tableData.sheets[name];
      // vm.positionOfInput(offsetLeft,offsetTop,height);
    },
    //实时改变值
    keyupFun(e) {
      console.log(e);
      let vm = this;
      vm.showVal = e.target.value;
      let data = vm.currentDataSheet.Data;
      data[vm.showPos] = e.target.value;
    },
    blurFun(e) {

    },
    focusCell(a, b) {
      console.log("focsll");
      let pos = "" + b + a;
      let val = this.currentDataSheet.Data;
      this.showPos = pos;
      this.showVal = val[pos];
      document.getElementsByClassName("table-td-title-2")[0].focus();
    },
    positionOfInput(offsetLeft,offsetTop,height){
      let selectWrap = document.getElementsByClassName("select-wrap")[0];
      selectWrap.style.left = offsetLeft + "px";
      selectWrap.style.top = offsetTop + "px";
      selectWrap.style.height = height + "px";
      selectWrap.style.width = "auto";
    },
    clk(e) {
      console.log("click");
      let vm = this;
      let height = e.target.offsetHeight,
        width = e.target.offsetWidth,
        offsetLeft = e.target.offsetLeft,
        offsetTop = e.target.offsetTop;
      vm.positionOfInput(offsetLeft,offsetTop,height);
      document.getElementsByClassName("table-input-content")[0].onkeyup = function(e) {
        vm.showVal = e.target.innerText;
        let data = vm.currentDataSheet.Data;
        data[vm.showPos] = e.target.innerText;
      };
      document.getElementsByClassName("table-input-content")[0].focus();
      document.getElementsByClassName("table-input-content")[0].onblur = function(e) {
        this.showVal = "";
      };
    },
    calculateManySheets(val){
      let len = val.length,sum = 0,vm = this;
      for(let i = 0;i < len;i++){
           if(val[i].indexOf("!") > -1){
            let data = val[i].split("!");
            let dataFirst = data[0];
            let dataLast = data[1].split(":");
            for(let j = 0;j < dataLast.length;j++){
              console.log(sum+"-------sum");
              sum += parseInt(vm.tableData.sheets[dataFirst].Data[dataLast[j]]);
            }
           }else{
             let data = val[i].split(":");
             for(let k = 0;k < data.length;k++){
              sum += parseInt(this.currentDataSheet.Data[data[k]]);
             }
           }
      }
      console.log(sum+"sum");
      return sum;
    },
    compute_fn(v) {
      //todo 目前：sum
      let val = this.currentDataSheet.Data;
      let sum = 0;
      if (v.indexOf("SUM") > -1) {
        if(v.indexOf("!") > -1){
         let data = v.split("(")[1].replace(")", "").split(",");
        sum = this.calculateManySheets(data);
        }else{
          let indexArr = v.split("(")[1].replace(")", "") .split(":");
          for (let i = 0; i < indexArr.length; i++) {
            sum += parseInt(val[indexArr[i]]);
          }
        }
      } else if (v.indexOf("AVERAGE")) {
        //avg
      }
      return sum;
    },
    isOk(row, col) {
      let temp = "" + col + row;
      let val = this.currentDataSheet.Data;
      if (val.hasOwnProperty(temp)) {
        var v = (val[temp] || "") + "";
        return v.indexOf("=") == 0 ? this.compute_fn(val[temp]) : v;
      }
    },
    getTotalRow(num) {
      num = num || 200;
      let colNum = [];
      for (let i = 1; i <= num; i++) {
        colNum.push(i);
      }
      return colNum;
    },
    getAlphabetArr() {
      let alphabetArr = [];
      for (let j = 65; j < 91; j++) {
        let ch = String.fromCharCode(j);
        alphabetArr.push(ch);
      }
      return alphabetArr;
    }
  }
};
</script>
<style scoped>
.select-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 3;
  background: #f5f5dc00;
}
.container {
  height: 500px;
  width: 100%;
  overflow-y: scroll;
  overflow-x: scroll;
}
.table-content,
.table-content * {
  margin: 0 auto;
  padding: 0;
  font-size: 14px;
  font-family: Helvetica, sans-serif;
}

.table-content {
  display: table;
  width: 2000px;
  border-collapse: collapse;
  table-layout: fixed; /* 固定宽 */
  /* word-break: break-all;
  word-wrap: break-word; */
}
.table-thead {
  display: table-header-group;
  table-layout: fixed;
  width: calc(100% - 1em);
}
.table-tr {
  display: table-row;
  table-layout: fixed;
}

.table-th {
  display: table-cell;
  font-weight: bold;
  width: 80px;
  height: 100%;
  border: 1px solid gray;
  text-align: center;
  vertical-align: middle;
  background-color: #e5e5e5;
  table-layout: fixed;
  /* word-wrap: break-word; */
}

.table-tr .table-td:first-child {
  width: 20px !important;
  background-color: #e5e5e5;
}

.table-td-title-1 {
  display: table-cell;
  font-weight: bold;
  width: 70px;
  height: 100%;
  border: 1px solid gray;
  text-align: center;
  vertical-align: middle;
  border-bottom: none;
}

.table-td-title-2 {
  display: table-cell;
  width: 1920px;
  height: 100%;
  border: 1px solid gray;
  text-align: center;
  vertical-align: middle;
  border-bottom: none;
}

.table-td {
  display: table-cell;
  overflow: hidden; 
  white-space: nowrap; 
  text-overflow: clip;
  width: 80px;
  border: 1px solid gray;
  text-align: center;
  vertical-align: middle;
  overflow: hidden;
  cursor: default;
}
</style>
