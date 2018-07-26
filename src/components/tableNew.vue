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
    <!-- 顶层的input输入框 -->
     <span class = "select-wrap">
        <div class="table-input-content" tabindex="0" contenteditable="true" dir="ltr" aria-autocomplete="list" aria-label="F12" style="max-height: 374px; min-height: 19px;border:1px solid #000;background:#DBF2F5">
          {{showVal}}
          </div>
      </span>
    <!-- 中间层合并、下拉框 -->
    <span class="middle-area" style="position:absolute;z-index=7;left:0;top:0;background:rgba(77,184,254,.5)">
          <!-- <div class="table-middle-content" tabindex="0" contenteditable="true" dir="ltr" aria-autocomplete="list" aria-label="F12" style="position:absolute;max-height: 374px; min-height: 19px;background:#DBF2F5;width:160px;height:22px;top:88px;left:240px;text-align:center;vertical-align:middle;">
          合并测试
          </div>
           <div  tabindex="0" contenteditable="true" dir="ltr" aria-autocomplete="list" aria-label="F12" style="position:absolute;max-height: 374px; min-height: 19px;background:#DBF2F5;width:400px;height:66px;top:44px;left:480px;text-align:center;vertical-align:middle;">
          合并测试2
          </div> -->
    </span>

	</div>
</div>
<!-- sheets -->
<div class="g-tabs">
        <div class="table-td" v-for="n in tableData.sheets.sheetNames" :key="n"  :label="n" @click="changeSheet(n)">{{n}}</div>
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
      currentDataSheet: "",
      tableData: {
        version: "11.1.0",
        tabStripRatio: 0.6,
        sheetCount: 2,
        activeSheetIndex: 1,
        sheets: {
          info: {
            name: "111.xlsx",
            selections: {
              "0": {
                row: 0,
                rowCount: 1,
                col: 0,
                colCount: 1
              },
              length: 1
            },
            defaults: {
              colHeaderRowHeight: 20,
              colWidth: 60,
              rowHeaderColWidth: 40,
              rowHeight: 30
            }
          },
          sheetNames: ["Sheet1", "Sheet2"],
          Sheet1: {
            rowHeight:17,
            colWidth:81,
            name: "Sheet1",
            merges:[
              {
              start:"E6",
              end:"F6"
              },
              {
              start:"G7",
              end:"G10"
              },
              {
              start:"C15",
              end:"D16"
              }
            ],
            selections:{
             location:"C12",
             selectVal:[
              {
                value: 's111',
                label: 's111'
              }, {
                value: 's222',
                label: 's222'
              }, {
                value: 's333',
                label: 's333'
                }]
            },
            rowCount: 200,
            columnCount: 26,
            data: {
              A1: {
                value: 11
              },
              C3: {
                value: 11
              },
              C4: {
                value: 11
              },
              A5: {
                value: 22,
                formula: "=SUM(C3:C4)"
              },
              E6: {
                value: "E6",
                mergeCell: ["E6", "F6"]
              },
              G7: {
                value: "G7he",
                mergeCell: ["G7", "G8", "G9", "G10"]
              },
              C15: {
                value: "c15he",//所以表格加载完了,再叠加在一层
                mergeCell: ["C15", "C16", "D15", "D16"]
              },
              C12: {
                value: "s111",
                selectOption: [
                  {
                    value: 's111',
                    label: 's111'
                  }, {
                    value: 's222',
                    label: 's222'
                  }, {
                    value: 's333',
                    label: 's333'
                  }
                ]
              }
            }
          },
          Sheet2: {
            name: "Sheet2",
            rowCount: 13,
            columnCount: 3,
            activeRow: 12,
            activeCol: 2,
            data: {
              A2: {
                value: 22,
                formula: "=SUM(Sheet1!C3:C4)"
              }
            }
          }
        }
      }
    }
  },
  created() {
    let sheetsAll = this.tableData.sheets;
    let sheetsNames = this.tableData.sheets.sheetNames;
    this.currentDataSheet = sheetsAll[sheetsNames[0]];
    
  },
  mounted() {
    this.showCombine();
   },
  watch: {},
  methods: {
    // <div class="table-middle-content" tabindex="0"
    //  contenteditable="true"" style="position:absolute;width:160px;height:22px;top:88px;
    // left:240px;text-align:center;vertical-align:middle;">
          
    //       </div>
    //将合并的格子遍历
    showCombine(){
      let parentNode = document.getElementsByClassName("middle-area")[0];
      let combineData = this.currentDataSheet.merges;
      for(let i = 0,len = combineData.length;i < len;i++){
          
          let offLeft = this.calculateLocation(combineData[i])[0]+"px";
          let offTop =  this.calculateLocation(combineData[i])[1]+"px";
          let width = this.calculateWH(combineData[i])[0]+"px";
          let height = this.calculateWH(combineData[i])[1]+"px";
          let value = this.currentDataSheet.data[combineData[i].start].value;
          let divNode = document.createElement("div");
          divNode.contentEditable = true;
          divNode.style.position = "absolute";
          divNode.style.backgroundColor = "#fff";
          divNode.style.border = "1px solid gray";
          divNode.style.height = height;
          divNode.style.width = width;
          divNode.style.left = offLeft;
          divNode.style.top = offTop;
          divNode.innerText = value;
          divNode.style.textAlign = "center";
          divNode.style.verticalAlign = "middle";
          divNode.onclick = this.clkCombine(offLeft,offTop,width,height,combineData[i].start,value);
          parentNode.appendChild(divNode);
      }
    },
    clkCombine(offLeft,offTop,width,height,pos,value){
      this.positionOfInput(offLeft, offTop, height, width);
    },
    //计算长和宽
    calculateWH(pos){//start:E1  end:F6
    let result = [];
     let startPos = [pos.start.match(/^[a-z|A-Z]+/gi).toString(),pos.start.match(/\d+$/gi).toString()];
     let endPos = [pos.end.match(/^[a-z|A-Z]+/gi).toString(),pos.end.match(/\d+$/gi).toString()];
     let width = (endPos[0].charCodeAt() - startPos[0].charCodeAt() + 1) * this.currentDataSheet.colWidth;
     let height = (parseInt(endPos[1]) - parseInt(startPos[1]) + 1) * this.currentDataSheet.rowHeight;
     result.push(width,height);
     console.log(result);
     return result;
    },
    //计算坐标
    calculateLocation(pos){
       let result = [];
       let startPos = [pos.start.match(/^[a-z|A-Z]+/gi).toString(),pos.start.match(/\d+$/gi).toString()];//A1
       console.log(startPos);
       let left = (startPos[0].charCodeAt() - 65 + 1) * this.currentDataSheet.colWidth;
       let top = parseInt(startPos[1]) * this.currentDataSheet.rowHeight;
       result.push(left,top);
      return result;
    },
    divKeyUp(e) {
      // this.currentDataSheet.Data[this.showPos] = this.showVal;
    },
    //点击当前表格
    changeSheet(name) {
      this.positionOfInput(0, 0, 0,0);
      this.currentDataSheet = this.tableData.sheets[name];
      // vm.positionOfInput(offsetLeft,offsetTop,height);
    },
    //实时改变值
    keyupFun(e) {
      console.log(e);
      let vm = this;
      vm.showVal = e.target.value;
      let data = vm.currentDataSheet.data;
      if(!!!data[vm.showPos].formula && data[vm.showPos] === 'object'){
        data[vm.showPos].value = e.target.value;
      }else{
        data[vm.showPos].formula = e.target.value;
      }
    },
    blurFun(e) {},
    focusCell(a, b) {
      this.showVal = "";
      let pos = "" + b + a;
      let val = this.currentDataSheet.data;
      this.showPos = pos;
      if(!!val[pos]){
        this.showVal = val[pos].formula ||val[pos].value;
        document.getElementsByClassName("table-td-title-2")[0].focus();
      }
    },
    positionOfInput(offsetLeft, offsetTop, height,width) {
      let selectWrap = document.getElementsByClassName("select-wrap")[0];
      selectWrap.style.left = offsetLeft + "px";
      selectWrap.style.top = offsetTop + "px";
      selectWrap.style.height = height + "px";
      selectWrap.style.minWidth = width + "px";
      selectWrap.style.width = "auto";

    },
    clk(e) {
      let vm = this;
      let height = e.target.offsetHeight,
        width = e.target.offsetWidth,
        offsetLeft = e.target.offsetLeft,
        offsetTop = e.target.offsetTop;
      vm.positionOfInput(offsetLeft, offsetTop, height, width);
      document.getElementsByClassName("table-input-content")[0].onkeyup = function(e) {
        vm.showVal = e.target.innerText;
        let data = vm.currentDataSheet.data;
        if(!!!data[vm.showPos].formula){
          data[vm.showPos].value = e.target.innerText;
        }else{
          data[vm.showPos].formula = e.target.innerText;
        }
      };
      document.getElementsByClassName("table-input-content")[0].focus();
      document.getElementsByClassName( "table-input-content")[0].onblur = function(e) {
        this.showVal = "";
      };
    },
    calculateManySheets(val) {
      let len = val.length,
        sum = 0,
        vm = this;
      for (let i = 0; i < len; i++) {
        if (val[i].indexOf("!") > -1) {
          let data = val[i].split("!");
          let dataFirst = data[0];
          let dataLast = data[1].split(":");
          for (let j = 0; j < dataLast.length; j++) {
            let sData = vm.tableData.sheets[dataFirst].data[dataLast[j]];
            if(!!sData){
              sum += parseInt(sData.value);
            }
          }
        } else {
          let data = val[i].split(":");
          for (let k = 0; k < data.length; k++) {
              let sData = vm.currentDataSheet.data[data[k]];
            if(!!sData){
            sum += parseInt(sData.value);
            }
          }
        }
      }
      return sum;
    },
    compute_fn(v) {
      //todo 目前：sum
      let val = this.currentDataSheet.data;
      let sum = 0;
      if (v.indexOf("SUM") > -1) {
        if (v.indexOf("!") > -1) {
          let data = v.split("(")[1].replace(")", "").split(",");
          sum = this.calculateManySheets(data);
        } else {
          let indexArr = v.split("(")[1].replace(")","").split(":");
          for (let i = 0; i < indexArr.length; i++) {
            if(!!val[indexArr[i]]){
              sum += parseInt(val[indexArr[i]].value);
            }
          }
        }
      } else if (v.indexOf("AVERAGE")) {
        //avg
      }
      return sum;
    },
    isOk(row, col) {
      let temp = "" + col + row;
      let val = this.currentDataSheet.data;
      if (val.hasOwnProperty(temp)) {
        var v = (val[temp].value || "") + "";
        var f = (val[temp].formula || "")+ "";
        return f.indexOf("=") == 0 ? this.compute_fn(f) : v;
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
  z-index: 9;
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
