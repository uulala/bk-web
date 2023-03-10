<template>
  <view class="content">
    <view class="count-box">
      <view>收入：{{ countObj.inNumber }}</view>
      <view>支出：{{ countObj.outNumber }}</view>
      <view>结余：{{ countObj.inNumber - countObj.outNumber }}</view>
    </view>
    <view class="my-list">
      <view
        class="list-item"
        v-for="item in flows.data"
        :key="item.id"
      >
        <view class="left-box">
          <!-- <view class="type-name">
                      <bk-item :iconName="iconMap[item.categoryId].iconName"></bk-item>
                      {{ iconMap[item.categoryId].typeName }}
                  </view> -->
          <view>{{ item.categoryName }}</view>
          <view class="create-info">
            <text class="user">{{ item.userName }}</text>
            <text class="time">{{ item.showTime }}</text>
          </view>
        </view>

        <view :class="item.categoryType === 2 ? 'in-number count-number' : 'out-number  count-number'">
          {{ item.amount }}
        </view>
      </view>
      <uni-load-more
        :status="loadStatus"
        @clickLoadMore="getFlowData(1)"
      ></uni-load-more>
    </view>
    <MoveableButton halfWidth="20">
      <view
        @click="handleAdd"
        class="add-icon"
      >+</view>
    </MoveableButton>
    <!-- -->
  </view>
</template>
<script lang='ts'>
import { defineComponent } from 'vue'
export default defineComponent({
  methods: {
    reload() {
      console.log('reload')
    }
  }
}
)
</script>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { iconMap } from '@/static/commonMap'
import MoveableButton from '@/components/MoveableButton.vue'
import { wxLogin, signIn, signUp, signOut } from '@/api/user'
import { getflows, getflowTotal } from '@/api/flow'
import { getBookList, createBook, getCategoryList } from '@/api/book'
import { ls } from '@/plugin/utils'

interface flowItem {
  uid: Number
  userId: String // 用户
  bkId: String
  bookId: String
  categoryType: Number // 收支类型
  categoryId: String
  bizTime: String // 时间
  amount: Number // 额度
  comment: String // 备注
}

let countObj = reactive({ inNumber: 0, outNumber: 0 }),
  page = reactive({ currentPage: 1, pageSize: 10 }),
  flows: { data: flowItem[] } = reactive({ data: [] })

let loadStatus = ref('more')

onMounted(() => {
  // signIn({ name: 'test', password: 'password' }).then(res => {
  //     console.log(res)
  // })

  signOut().then(res => { })
  wxLogin((result) => {
    if (result.msg === '注册成功') {
      // 默认创建一个日常账本
      getBookList({ isPublic: 1 }).then(res => {
        const data = res.data
        createBook({ publicBkUuid: data[0].uuid, name: '日常账本', img: 'https://up.enterdesk.com/edpic_source/b9/b7/be/b9b7bed24c1a05f4d197508204d0d043.jpg' }).then(res => {
          if (res.code === 1) {
            getBookData()
          }
        })
      })
    } else {
      // 登录成功
      // 默认有bookId, 则有其他相关的book数据
      if (ls.get('bookId')) {
        getFlowData()
      } else {
        getBookData()
      }
    }
  })
})

// 获取用户账本
function getBookData() {
  getBookList({}).then(res => {
    const data = res.data
    const bkId = data[0].uuid
    const currentBook = data[0]
    ls.set('bookId', bkId)
    ls.set('currentBook', currentBook)
    ls.set('allBook', data)

    getCategoryList(currentBook.categorys.join(',')).then(res => {
      ls.set('categorys', res.data)
      getFlowData()
    })
  })
}

function getFlowData(flag) {

  getflowTotal({
    bookId: ls.get('bookId'),
    startTime: ls.getStartTime('M'),
    endTime: ls.getTime()
  }).then(res => {
    console.log(res)
    res.data.map(item => {
      if (item._id === 3) {
        countObj.outNumber = item.totalAmount
      } else if (item._id === 2) {
        countObj.inNumber = item.totalAmount
      }
    })

  })
  if (flag) {
    page.currentPage += 1
  }
  loadStatus.value = 'loading'
  // 分页查询
  getflows(Object.assign(
    {
      bookId: ls.get('bookId'),
    },
    page)).then(function (res) {

      const flowsData = res.data
      const categorys = ls.get('categorys')
      flowsData.map(item => {
        item.showTime = ls.formatTime(parseInt(item.bizTime), 'YYYY-mm-dd HH:mm')
        item.categoryName = categorys.find(it => it.uuid === item.categoryId).name
      })
      if (flag) {
        if (flowsData.length === 0) {
          loadStatus.value = 'noMore'
        } else {
          loadStatus.value = 'more'
          flows.data = [...flows.data, ...flowsData]
        }
      } else {
        flows.data = flowsData
        loadStatus.value = 'more'
      }
    })
}

function handleAdd() {
  uni.navigateTo({
    url: '/pages/addflow/index',
    events: {
      refreshData(data) {
        console.log(data)
      }
    },
  })
}
</script>

<style lang="scss" scoped>
.content {
  position: relative;
}

.count-box {
  margin-bottom: 10px;
  padding: 8px;
  border-bottom: 1px solid #ccc;
  background: rgb(69, 128, 88);
  color: #fff;
  display: flex;
  justify-content: space-between;

}

.my-list {
  padding: 8px;
  height: calc(100vh - 10px - 10vh);
  overflow: auto;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  padding: 3px 0;
  margin: 2px 0;

  border-bottom: 1px dashed #ccc;
}

.create-info {
  color: #999;

  .user {
    margin-right: 5px;
    color: #666;
  }
}

.in-number {
  color: rgb(16, 119, 40)
}

.out-number {
  color: rgb(255, 37, 37)
}

.add-icon {
  border: 1px solid #409eff;
  background: #8dc6ff;
  border-radius: 50%;
  font-size: 26px;
  height: 10vw;
  width: 10vw;
  text-align: center;
}
</style>
