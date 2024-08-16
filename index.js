let ans;

document.getElementById("MaterialForm").addEventListener("submit", function (event) {
    event.preventDefault();
    let str = document.getElementById("input").value || document.getElementById("input").placeholder;
    const segmenter = new Intl.Segmenter('ja-JP', { granularity: 'grapheme' });
    let arr = Array.from(segmenter.segment(str)).map(segment => segment.segment);

    let arrx = [...arr]; // Create a copy of arr
    const hrg = /^[\u3041-\u3093]+$/u;

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
                    (i - 2 >= 0 && arr[i - 2] !== undefined && hrg.test(arr[i - 2])) ||
                    (arr[i - 2] === undefined && hrg.test(arr[i]))
                ) {
                    arrx[i - 1] = "っ";
                } else {
                    arrx[i - 1] = "ッ"; // Replace previous character with "ッ" if it's not already "ッ" or "っ"
                }
            }
        }
    }

    let strx = arrx.join(''); // Join without any separator
    const answer = String(strx);
    const textArea = document.getElementById('output');
    textArea.value = answer;
    ans = answer;
});

function copy() {
    if (!navigator.clipboard) {
        alert("このブラウザでは対応してないみたいですorz");
        return;
    }
    navigator.clipboard.writeText(document.getElementById('output').value).then(
        () => {
            alert('コピー成功٩(ˊᗜˋ*)و');
        },
        () => {
            alert('コピー失敗˚‧º·(˚ ˃̣̣̥⌓˂̣̣̥ )‧º·˚');
        });
}

function tweet() {
    // チェックボックスの状態を取得
    const includeText = document.getElementById('tweetInputCheckbox').checked;
    const includeURL = document.getElementById('tweetURLCheckbox').checked;

    // シェアする内容を初期化
    let tweetContent = ans + "%0D%0A";

    // 原文が選択されている場合のテキスト
    if (includeText) {
        tweetContent += "%0D%0A" + "【原文】"
        tweetContent += document.getElementById('input').value || document.getElementById('input').placeholder;
    }

    // URLが選択されている場合のURL
    if (includeURL) {
        if (tweetContent) {
            tweetContent += ' '; // 原文とURLの間にスペースを挿入
        }
        tweetContent += window.location.href; // 必要に応じて適切なURLを挿入
    }

    // ツイッターのシェアリンクを生成
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetContent}`;

    // 新しいタブでツイートを開く
    window.open(tweetUrl, '_blank');
}
