<template>
    <view class="content">
        <view
            class="user-box box"
            v-if="!isEdit"
        >
            <image
                class="avatar"
                :src="realData.avatarUrl"
                @click="isEdit = true"
            ></image>
            <text
                class="nickname"
                @click="isEdit = true"
            >{{ realData.nickName || '微信用户' }}</text>
        </view>
        <view v-else>
            <button
                class="avatar-wrapper"
                open-type="chooseAvatar"
                @chooseavatar="onChooseAvatar"
            >
                <image
                    class="avatar"
                    :src="formData.avatarUrl"
                ></image>
            </button>
            <van-cell title="昵称">
                <input
                    type="nickname"
                    class="weui-input"
                    placeholder="请输入昵称"
                    :value="formData.nickName"
                    @change="handleChangeName"
                />
            </van-cell>

            <view class="box">
                <view
                    class="save-btn box"
                    @click="handleupdate"
                >保存</view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ls } from '@/plugin/utils';
import { ref, reactive } from 'vue'
import { updateUser } from '@/api/user'
const userinfo = ls.get('userinfo')

let isEdit = ref(false)

const avatarUrl = userinfo.avatar || ref('/static/img/avatar.png'),
    nickName = userinfo.name

let formData = reactive({ avatarUrl, nickName }),
    realData = reactive({ avatarUrl, nickName })

function onChooseAvatar(e) {
    formData.avatarUrl = e.detail.avatarUrl
}

function handleChangeName(e) {
    formData.nickName = e.detail.value
}

function handleupdate() {
    const { nickName, avatarUrl } = formData
    updateUser({ _id: userinfo._id, name: nickName, avatar: avatarUrl }).then(res => {
        ls.set(userinfo, res.data)
        isEdit.value = false
        realData.avatarUrl = avatarUrl
        realData.nickName = nickName
    })
}
</script>

<style lang="scss" scoped>
.box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.user-box {
    justify-content: flex-start;
    padding: 10vw 5vw;
    border: 1px solid #eee;
    margin: 5vw;
    border-radius: 5px;
    background: #e5e5e5;
    ;
}

.avatar-wrapper {
    padding: 0;
    width: 20vw !important;
    border-radius: 50%;
    margin-top: 40px;
    margin-bottom: 40px;
}

.avatar {
    display: block;
    width: 20vw;
    height: 20vw;
    border-radius: 50%;
}

.nickname {
    margin-left: 10px;
    font-weight: 600;
}

.save-btn {
    width: 80vw;
    height: 10vw;
    border-radius: 5px;
    // background: #a6e4ff;
    color: #3cc51f;
    border: 1px solid #3cc51f;
    margin: 10px 0;
}
</style>
