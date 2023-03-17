<template>
  <layout pageName='index' >
      <view
        class="modal"
        v-if="loaded"
      >
        <!-- 数据初始化中... -->
        <van-loading
          type="spinner"
          color="#1989fa"
        >数据初始化中...</van-loading>
      </view>
      <template v-slot:header>
          <view class="count-box">
        <view>结余：{{ countObj.inNumber - countObj.outNumber }}</view>

        <view class="bottom">
          <view style="margin-right: 15px"> 收入：{{ countObj.inNumber }}</view>
          <view>支出：{{ countObj.outNumber }}</view>
        </view>
      </view>
      </template>
      
      <view class="my-list" >
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
          :contentText="{
            contentdown: '点击查看更多',
            contentrefresh: '正在加载...',
            contentnomore: '没有更多数据了'
          }"
          @clickLoadMore="getMoreData"
          v-if="flows.data.length > 9"
        ></uni-load-more>
      </view>
      <MoveableButton>
        <view
          @click="handleAdd"
          class="add-icon"
        >+</view>
      </MoveableButton>
  </layout>
</template>
<script lang='ts'>
import { ref, reactive, onMounted, defineComponent } from 'vue'
import { iconMap } from '@/static/commonMap'

import { getflows, getflowTotal } from '@/api/flow'
import { getBookList, createBook, getCategoryList } from '@/api/book'

import { ls } from '@/plugin/utils'
import { wxLogin, signIn, signUp, signOut, delUser } from '@/api/user'

import MoveableButton from '@/components/MoveableButton.vue'
import Layout from '@/components/Layout.vue'


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

export default defineComponent({
  components: { MoveableButton, Layout },
  methods: {
    reloadData() {
      this.page.currentPage = 1
      this.getBookAndFlowData()
    },
    reloadFlowData() {
      this.page.currentPage = 1
      this.getFlowData()
    },
  },
  onShow() {
    console.log('on show ..')
  },
  setup() {
    let countObj = reactive({ inNumber: 0, outNumber: 0 }),
      page = reactive({ currentPage: 1, pageSize: 10 }),
      flows: { data: flowItem[] } = reactive({ data: [] })

    let loadStatus = ref('more'),
      loaded = ref(true)

    onMounted(() => {
      // 默认尝试登录
      wxLogin((result) => {
        // 默认有bookId, 则有其他相关的book数据
        if (ls.get('bookId')) {
          getFlowData()
        } else {
          getBookAndFlowData()
        }
      })
    })

    // 获取用户账本
    function getBookAndFlowData() {
      getBookList({}).then(res => {
        const data = res.data
        if (data[0]) {
          // 已经有账本
          const bkId = data[0].uuid
          const currentBook = data[0]
          ls.set('bookId', bkId)
          ls.set('currentBook', currentBook)
          ls.set('allBook', data)

          getCategoryList(currentBook.categorys.join(',')).then(res => {
            ls.set('categorys', res.data)
            getFlowData()
          })
        } else {
          // 没有账本，默认创建一个日常账本
          getBookList({ isPublic: 1 }).then(res => {
            const data = res.data
            createBook({ publicBkUuid: data[0].uuid, name: '日常账本', img: 'https://up.enterdesk.com/edpic_source/b9/b7/be/b9b7bed24c1a05f4d197508204d0d043.jpg' }).then(res => {
              if (res.code === 1) {
                getBookAndFlowData()
              }
            })
          })
        }
      })
    }

    function getFlowData() {
      console.log('getFlowData')
      getTotalData()
      getFlowList()
    }

    function getTotalData() {
      getflowTotal({
        bookId: ls.get('bookId'),
        startTime: ls.getStartTime('M'),
        endTime: ls.getTime()
      }).then(res => {
        loaded.value = false
        console.log(res)
        res.data.map(item => {
          if (item._id === 3) {
            countObj.outNumber = item.totalAmount
          } else if (item._id === 2) {
            countObj.inNumber = item.totalAmount
          }
        })

      })
    }

    function getFlowList(isMore?: boolean) {
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
          if (isMore) {
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

    function getMoreData() {
      page.currentPage += 1
      getFlowList(true)
    }

    return {
      countObj,
      page,
      flows,
      loadStatus,
      loaded,
      getBookAndFlowData,
      getFlowData,
      handleAdd,
      getMoreData
    }
  }
}
)
</script>


<style lang="scss" scoped>
.modal {
  position: absolute;
  z-index: 10000;
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
}

.count-box {
  border-bottom: 3px dotted  #fff;
  font-size: 16px;
  // height: 15vw;
  box-sizing: border-box;
  padding: 10px;
  margin-bottom: 5px;

  view{
    height: 50%;
  }

  .bottom {
    display: flex;
    // justify-content: space-around
  }
}

.my-list {
  padding: 8px;
  // height: 100%;
  // overflow: auto;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  padding: 3px 0;
  margin: 2px 0;

  border-bottom: 1px dashed #fff;
}

.create-info {
  color: #333;

  // .user {
  //   margin-right: 5px;
  //   color: #666;
  // }
}

.in-number {
  color: rgb(16, 119, 40)
}

.out-number {
  color: rgb(255, 37, 37)
}

.add-icon {
  border: 1px solid #3cc51f;
  background: #3cc51f;
  color: #fff;
  border-radius: 50%;
  font-size: 26px;
  height: 10vw;
  width: 10vw;
  text-align: center;
}
</style>
