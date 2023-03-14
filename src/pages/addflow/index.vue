<template>
  <view class="layout">
    <!-- 大类 -->
    <view class="tab-box box">
      <view
        class="tab-item middle"
        v-for="item in categoryTypeList"
        :key="item.value"
        :class="formData.categoryType === item.value ? 'active' : ''"
        @click="() => handleChangeType(item)"
      >{{ item.lable }}</view>
    </view>
    <!-- 选中内容 -->
    <view class="box amount-box">
      <view class="category">{{ formData.name }}</view>
      <view class="num">{{ formData.amount }}</view>
    </view>

    <!-- 小类:库 -->
    <view class="box category-box">
      <view
        v-for="item in showList"
        :key="item.uuid"
        @click="() => handleChangeCategory(item)"
        :class="formData.uuid === item.uuid ? 'active category-item' : 'category-item'"
      >
        {{ item.name }}
      </view>
    </view>
    <view class="bottom-box">
      <!-- 备注： -->
      <view class="comment-box">
        备注：<van-field
          v-model="formData.comment"
          placeholder="请输入备注"
          :border="false"
          class="comment"
        />
      </view>
      <!-- 日期 -->
      <view>
        <van-popup
          :show="show"
          position="bottom"
          custom-style="height: 60%;"
          @close="onClose"
        >
          <van-datetime-picker
            type="datetime"
            :value="formData.currentDate"
            @input="handleChangeDate"
            @confirm="show = false"
            @cancel="handleCancleDate"
          />
        </van-popup>
        <view
          @click="handleShowDate"
          class="date-text"
        >{{ showDate }}</view>
      </view>
      <!-- 操作栏 -->
      <view class="btn-box">
        <view class="number-box">
          <view
            v-for="item in numberArr"
            :key="item"
            @click="() => handleChangeNumber(item)"
          >{{ item }}</view>
        </view>
        <view class="menu-box">
          <view
            class=""
            @click="handleDelNum"
          >删除</view>
          <!-- <view
            class=""
            @click="handleSavethenAdd"
          >保存再记</view> -->
          <view
            class=""
            @click="handleSave"
          >保存</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang = "ts" >
import { ref, reactive, onMounted, computed } from 'vue'
import { getCategoryList } from '@/api/book'
import { createFlow } from '@/api/flow'
import { ls } from '@/plugin/utils'

let categorys: {
  data: Array<{}>
} = reactive({ data: [] }),
  formData: {
    categoryType: number,
    uuid?: number,
    currentDate: number,
    amount?: String,
    comment?: string
  } = reactive({
    categoryType: 2,
    currentDate: ref(new Date().getTime()),
  }),
  categoryTypeList = reactive([
    { value: 2, lable: '收入' },
    { value: 3, lable: '支出' },
    // { value: 1, lable: '转账' },
    // { value: 0, lable: '借贷' }
  ]),
  numberArr = reactive([1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, '00'])

let show = ref(false),
  defaultDate = ref(0),
  bookId = ref(ls.get('bookId'))

categorys.data = ls.get('categorys')

const tempData = ls.get('formData')
if (tempData) {
  Object.assign(formData, tempData, { amount: '', currentDate: new Date().getTime() })
}

const showList = computed(() => {
  console.log(formData.categoryType)
  return categorys.data.filter(item => {
    if (item.categoryType === formData.categoryType) return item
  })
}
)

const showDate = computed(() => {
  const d = new Date(formData.currentDate)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`
})
function handleChangeType(item) {
  formData.categoryType = item.value
}

function handleChangeCategory(item) {
  Object.assign(formData, item)
}

function handleChangeDate(e) {
  formData.currentDate = e.detail
}

function handleChangeNumber(num) {
  formData.amount += num
}
function handleDelNum() {
  formData.amount = ''
}

function onClose() {
  show.value = false
}

function handleShowDate() {
  show.value = true
  defaultDate.value = formData.currentDate
}
function handleCancleDate() {
  show.value = false
  formData.currentDate = defaultDate.value
}

function handleSave() {
  ls.set('formData', formData)
  const { categoryType, uuid: categoryId, currentDate, comment, amount } = formData
  const params = { bookId: bookId.value, categoryType, categoryId, bizTime: new Date(currentDate).getTime(), amount: parseFloat(amount), comment: comment }
  console.log(params)

  createFlow(params).then(res => {
    console.log(res.data)
    uni.navigateBack({
      delta: 1,
      success(res) {
        let pages = getCurrentPages()
        pages[0].$vm.reload()
      }
    })
  })
}
</script>
  
<style>
.layout {
  position: relative;
  box-sizing: border-box;
  height: 100vh;
  padding-bottom: 10vw;
}

.box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}


.tab-box {
  background: rgb(69, 128, 88);
  padding-bottom: 10vw;
}

.tab-item {
  width: 20%;
  height: 10vw;
  text-align: center;
}

.amount-box {
  position: absolute;
  top: 12vw;
  width: 96vw;
  justify-content: space-between;
  height: 13vw;
  border: 1px solid #eee;
  border-radius: 5%;
  padding: 4vw;
  background: #fff;
  box-sizing: border-box;
  left: 2vw;
}

.amount-box .num {
  width: 80%;
  text-align: right;
}

.category-box {
  padding-top: 5vw;
}

.category-item {
  margin: 5px;
}

.active {
  color: #3cc51f;
}

.bottom-box {
  position: absolute;
  bottom: 0;
  width: 100vw;
  height: 60vw;
  background: #eee;
}

.date-text {
  background: #fff;
  border-radius: 5%;
  padding: 5px;
}

.comment-box {
  height: 10vw;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: #fff;
}

.comment {
  width: 80%;
}

.btn-box {
  display: flex;
  align-items: center;
  background: #eee;
}

.number-box {
  width: 80%;
  display: flex;
  flex-wrap: wrap;
}

.number-box view {
  align-items: center;
  display: flex;
  justify-content: center;
  width: 33.3%;
  height: 10vw;
  border: 1px solid #fff;
  box-sizing: border-box;
}

.menu-box {
  width: 20%;
}

.menu-box view {
  align-items: center;
  display: flex;
  justify-content: center;
  height: 10vw;
  border: 1px solid #fff;

}

.menu-box view:last-child {
  height: 30vw;
}

.middle,
.child-middle view {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
  