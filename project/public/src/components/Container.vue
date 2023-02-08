<template>
    <div id="container" class="container">
        <div id="content" class="content">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.container {
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    animation: fadeInAnimation ease 0.5s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
}

@keyframes fadeInAnimation {
    0% {
        transform: translateY(-1%);
        opacity: 0;
    }
    100% {
        transform: translateY(0%);
        opacity: 1;
     }
}

.content {
    display: flex;
    text-align: center;
    flex-direction: column;
    width: 480px;
    padding: 10px;
    border-radius: 30px;
    background-color: #000000;
    box-shadow: 0px 0px 10px #ddd;
    margin: auto;
}   
</style>