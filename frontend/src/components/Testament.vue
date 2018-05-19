<template>
  <div class="hello">
    <!-- <ul v-for="element in list" :key="element">
      {{ element }}
    </ul> -->
    <div class="selectTestSource">
      <!-- <input :placeholder="'sourceFilePath'" v-model="sourceFilePath" disabled="disabled"> -->
      <input type="file" id="sourceFile" @change="selectSourceFile">
      <br>
      <input :id="'className'" :placeholder="'testClassFullName'" v-model="testClassFullName" disabled='disabled'>
      <button :id="'uploadButton'" v-on:click="uploadSourceFile" disabled='disabled'>Upload</button>
    </div>
    <div v-if="fileChosen === true">
      <select v-model="selected" name="selectMethod">
        <option label="Please choose the method to be tested" value="-1">
          Please choose the method to be tested
        </option>
        <option v-for="(element, index) in list" :key="index" :value="index" :label="element">
        </option>
      </select>
      <br>
      <input type="radio" value="singleTest" v-model="testType" id="SingleTestCase">
      <label for="SingleTestCase">SingleTestCase</label>
      <input type="radio" value="batchTest" v-model="testType" id="BatchTestCases">
      <label for="BatchTestCases">BatchTestCases</label>
    </div>
    <div v-if="testType === 'singleTest' && selected >= 0">
      <input v-for="n in (data[selected].ele.length - 3)" :key="n" :placeholder="'param[' + (n - 1) + ']'" v-model="testCase[n - 1]" >
      <input :placeholder="'retVal'" v-model="testCase[data[selected].ele.length - 3]" >
    </div>
    <div v-if="testType === 'batchTest' && selected >= 0">
      <input type="file" id="xlsFile" @change="selectXlsFile">
    </div>
    <div v-if="selected >= 0 && testType != null">
      <button v-on:click="test">Test</button>
    </div>
    <div class="testResultSingle" v-if="selected >= 0 && testType === 'singleTest'">
      {{ testResult }}
    </div>
    <div class="testResultBatch" v-if="selected >= 0 && testType === 'batchTest' && testResult != null">
      <hr>
      <!-- {{ testResult }} -->
      <li>{{ 'Number of successful test cases: ' + successCnt }}</li>
      <li>/</li>
      <li>{{ 'Number of test cases: ' + caseCnt }}</li>
      <br>
      {{ 'Success rate: ' + (successCnt / caseCnt * 100.0) + '%' }}
      <br>
      <canvas id="canvas_circle" width="290" height="200"></canvas>
      <table border="1" v-if="testResult != null" align="center">
        <tr>
          <td>
            case no.
          </td>
          <td v-for="n in (data[selected].ele.length - 3)" :key="n">
            {{ 'param[' + (n - 1) + ']' }}
          </td>
          <td>
            expected value
          </td>
          <td>
            result
          </td>
        </tr>
        <tr v-for="(element, index) in testResult" :key="index">
          <td>
            {{ index + 1 }}
          </td>
          <td v-for="(cell, index2) in element.cells" :key="index2">
            {{ cell }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

axios.defaults.withCredentials = true

export default {
  name: 'Testament',
  data () {
    return {
      filePath: '/Users/nemoremold/Documents/Projects/Project DT/src/main/java/org/latheild/dt/testUnit/',
      sourceFilePath: '',
      xlsFilePath: '',
      testClassFullName: '',
      fileChosen: false,
      testType: null,
      data: [],
      list: [],
      selected: -1,
      testCase: [],
      testResult: [],
      caseCnt: 0,
      successCnt: 0,
      data_arr: [],
      text_arr: ['Failure', 'Success'],
      color_arr: ['RED', 'GREEN']
    }
  },
  mounted: function () {

  },
  methods: {
    uploadSourceFile: function () {
      var context = this
      axios.post('http://localhost:8080/uploadSource', {
        filePath: context.sourceFilePath,
        className: context.testClassFullName
      })
        .then(function (response) {
          console.log(response)
          context.data = response.data.funcs
          context.fileChosen = true
          context.makeStrings()
        })
        .catch(function (error) {
          context.fileChosen = false
          console.log(error)
        })
    },
    makeStrings: function () {
      var context = this
      var temp = []
      for (var i = 0; i < context.data.length; ++i) {
        temp = context.data[i].ele
        var funcTmp = temp[0] + '('
        if (temp.length > 3) {
          funcTmp += temp[1]
          for (var j = 2; j < temp.length - 2; ++j) {
            funcTmp += (', ' + temp[j])
          }
        }
        funcTmp += ('): ' + temp[temp.length - 2] + ' ' + temp[temp.length - 1])
        context.$set(context.list, i, funcTmp)
      }
      console.log(context.list)
    },
    selectSourceFile: function (e) {
      var context = this
      context.selected = -1
      context.fileChosen = false
      context.testClassFullName = null
      console.log(e.target.files[0])
      if (e.target.files[0]) {
        context.sourceFilePath = context.filePath + e.target.files[0].name
        console.log(context.sourceFilePath)
        document.getElementById('className').disabled = null
      } else {
        document.getElementById('className').disabled = 'disabled'
        // console.log(context.testClassFullName)
        context.testClassFullName = ''
        context.sourceFilePath = ''
        context.xlsFilePath = ''
        context.data = null
        context.testResult = null
        context.caseCnt = 0
        context.successCnt = 0
        context.testType = null
        // console.log(context.testClassFullName)
      }
    },
    selectXlsFile: function (e) {
      var context = this
      context.testResult = null
      context.caseCnt = 0
      context.successCnt = 0
      if (e.target.files[0]) {
        context.xlsFilePath = context.filePath + e.target.files[0].name
        console.log(context.xlsFilePath)
      } else {
        context.xlsFilePath = ''
        context.testResult = null
        // console.log(context.testClassFullName)
      }
    },
    test: function () {
      var context = this
      if (context.testType === 'singleTest') {
        axios.post('http://localhost:8080/singleTest', {
          filePath: context.sourceFilePath,
          className: context.testClassFullName,
          options: context.data[context.selected].ele,
          objects: context.testCase
        })
          .then(function (response) {
            console.log(response)
            context.testResult = response.data
          })
          .catch(function (error) {
            console.log(error)
          })
      } else {
        axios.post('http://localhost:8080/batchTest', {
          filePath: context.sourceFilePath,
          className: context.testClassFullName,
          options: context.data[context.selected].ele,
          xlsPath: context.xlsFilePath
        })
          .then(function (response) {
            console.log(response)
            context.testResult = response.data.sheets[0].rows
            context.caseCnt = response.data.sheets[0].totalCount
            context.successCnt = response.data.sheets[0].successCount
            context.inite()
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    inite: function () {
      var context = this
      var tmp = [this.caseCnt - this.successCnt * 1.0 / this.caseCnt, this.successCnt * 1.0 / this.caseCnt]
      context.data_arr = tmp

      context.drawCircle('canvas_circle', context.data_arr, context.color_arr, context.text_arr)
      context.drawCircle('canvas_circle', context.data_arr, context.color_arr, context.text_arr)
    },
    drawCircle: function (canvasId, dataArr, colorArr, textArr) {
      var c = document.getElementById(canvasId)
      var ctx = c.getContext('2d')

      var radius = c.height / 2 - 20
      var ox = radius + 20
      var oy = radius + 20

      var width = 30
      var height = 10
      var posX = ox * 2 + 20
      var posY = 30
      var textX = posX + width + 5
      var textY = posY + 10

      var startAngle = 0
      var endAngle = 0
      for (var i = 0; i < dataArr.length; i++) {
        endAngle = endAngle + dataArr[i] * Math.PI * 2
        ctx.fillStyle = colorArr[i]
        ctx.beginPath()
        ctx.moveTo(ox, oy)
        ctx.arc(ox, oy, radius, startAngle, endAngle, false)
        ctx.closePath()
        ctx.fill()
        startAngle = endAngle

        ctx.fillStyle = colorArr[i]
        ctx.fillRect(posX, posY + 20 * i, width, height)
        ctx.moveTo(posX, posY + 20 * i)
        ctx.font = 'bold 12px 微软雅黑'
        ctx.fillStyle = colorArr[i]
        var percent = textArr[i] + '：' + 100 * dataArr[i] + '%'
        ctx.fillText(percent, textX, textY + 20 * i)
      }
    }
  },
  watch: {
    selected: function () {
      var context = this
      var newParams = []
      context.testCase = newParams
    },
    testClassFullName: function () {
      var context = this
      context.fileChosen = false
      context.selected = -1
      context.testType = null
      if (context.testClassFullName) {
        document.getElementById('uploadButton').disabled = null
      } else {
        document.getElementById('uploadButton').disabled = 'disabled'
      }
    },
    testType: function () {
      var context = this
      context.testResult = null
      context.caseCnt = 0
      context.successCnt = 0
      context.testCase = []
      context.xlsFilePath = ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 5px;
}
a {
  color: #42b983;
}
</style>
