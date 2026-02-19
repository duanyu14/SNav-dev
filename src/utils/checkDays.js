import { h } from 'vue';

const anniversaries = {
  4.4: "清明节",
  5.12: "汶川大地震纪念日",
  7.7: "中国人民抗日战争纪念日",
  9.18: "九·一八事变纪念日",
  12.13: "南京大屠杀死难者国家公祭日",
  //这里写日期可以测试默哀模式: "测试日"
};

export function checkDays() {
  const myDate = new Date();
  const mon = myDate.getMonth() + 1;
  const date = myDate.getDate();
  const key = `${mon}.${date}`;

  if (Object.prototype.hasOwnProperty.call(anniversaries, key)) {
    console.log(`今天是${anniversaries[key]}`);

    // 页面变灰
    const gray = document.createElement("style");
    gray.innerHTML = "html{filter: grayscale(100%)}";
    document.head.appendChild(gray);

    // 显示带蜡烛图标的提示
    if (window.$message) {
      window.$message.info(`今天是${anniversaries[key]}`, {
        duration: 14000,
        icon: () => h('img', {
          src: '/icon/candle.png',
          style: {
            width: '20px',
            height: '20px',
            verticalAlign: 'middle',
            marginRight: '8px',
          },
        }),
      });
    }
  }
}