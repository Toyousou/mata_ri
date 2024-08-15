document.getElementById("MaterialForm").addEventListener("submit", function (event) {
    event.preventDefault();
    let str = document.getElementById("input").value || document.getElementById("input").placeholder;
    const segmenter = new Intl.Segmenter('ja-JP', { granularity: 'grapheme' });
    let arr = Array.from(segmenter.segment(str)).map(segment => segment.segment);

    let arrx = [...arr]; // Create a copy of arr
    hrg = /^[\u3041-\u3093]+$/u;


    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === "ッ" || arr[i] === "っ") {
            if (i + 1 < arr.length) {
                arrx[i] = arr[i + 1]; // Replace "ッ" or "っ" with the next character
                arrx[i + 1] = "ー";   // Replace the next character with "ー"
            }
        } else if (arr[i] === "ー") {
            if (i > 0) {
                arrx[i] = arrx[i - 1]; // Replace "ー" with the previous character
                if (
                    (arr[1 - 2] !== null && hrg.test(arr[i - 2]))
                    ||
                    (arr[i - 2] === null && hrg.test(arr[i]))
                ) {
                    arrx[i - 1] = "っ"
                } else {
                    arrx[i - 1] = "ッ"; // Replace previous character with "ッ" if it's not already "ッ" or "っ"
                }
            }
        }
    }

    let strx = arrx.join(''); // Join without any separator
    answer = String(strx);
    var textArea = document.getElementById('output');
    textArea.value = answer
});


function copy() {
    if (!navigator.clipboard) {
        alert("このブラウザでは対応してないみたいですorz");
        return;
    }
    navigator.clipboard.writeText(answer).then(
        () => {
            alert('コピー成功٩(ˊᗜˋ*)و');
        },
        () => {
            alert('コピー失敗˚‧º·(˚ ˃̣̣̥⌓˂̣̣̥ )‧º·˚');
        });
}


function tweet() {
    let url = encodeURIComponent(location.href)
    window.open("https://twitter.com/share?text=" + answer + "&url" + url)
}
