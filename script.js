// script.js

function copyText(text) {
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.value = text;
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    const copyButton = event.target;
    copyButton.innerText = 'Sao chép!';
    copyButton.style.backgroundColor = '#16a34a';
    setTimeout(() => {
        copyButton.innerText = copyButton.getAttribute('data-original-text');
        copyButton.style.backgroundColor = '#2563eb';
    }, 5000);
}

function generateBookmarklet() {
    const deviceIdsInput = document.getElementById("deviceIdsInput").value.trim();
    if (!deviceIdsInput) {
        alert("Vui lòng nhập ít nhất một deviceID.");
        return;
    }

    const deviceIDs = deviceIdsInput.split('\n').map(id => id.trim()).filter(id => id !== "");
    const now = new Date();
    const timestamp = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    let bookmarkletCode = `javascript:(function(){\n`;
    bookmarkletCode += `    const deviceIDs = ${JSON.stringify(deviceIDs)};\n`;
    bookmarkletCode += `    const timestamp = "${timestamp}";\n`;
    bookmarkletCode += `    deviceIDs.forEach((deviceID, index) => {\n`;
    bookmarkletCode += `        const backupName = \`M\${index + 1} \${timestamp}\`;\n`;
    bookmarkletCode += `        fetch(\`https://ifake.pro/manager/device/\${deviceID}/sessions\`, {\n`;
    bookmarkletCode += `            headers: { accept: "*/*", "content-type": "application/x-www-form-urlencoded; charset=UTF-8" },\n`;
    bookmarkletCode += `            body: \`action=backup&name=\${backupName}\`,\n`;
    bookmarkletCode += `            method: "POST",\n`;
    bookmarkletCode += `            mode: "cors",\n`;
    bookmarkletCode += `            credentials: "include"\n`;
    bookmarkletCode += `        }).then(() => {\n`;
    bookmarkletCode += `            console.log(\`✅ Tiến hành backup với tên: \${backupName}\`);\n`;
    bookmarkletCode += `            setTimeout(() => {\n`;
    bookmarkletCode += `                fetch(\`https://ifake.pro/manager/device/\${deviceID}/tools\`, {\n`;
    bookmarkletCode += `                    headers: { accept: "*/*", "content-type": "application/x-www-form-urlencoded; charset=UTF-8" },\n`;
    bookmarkletCode += `                    body: "action=fake_clean",\n`;
    bookmarkletCode += `                    method: "POST",\n`;
    bookmarkletCode += `                    mode: "cors",\n`;
    bookmarkletCode += `                    credentials: "include"\n`;
    bookmarkletCode += `                }).then(() => console.log(\`✅ DeviceID \${deviceID} đã được làm sạch\`));\n`;
    bookmarkletCode += `            }, 3000);\n`;
    bookmarkletCode += `        }).catch(err => console.error("Error:", err));\n`;
    bookmarkletCode += `    });\n`;
    bookmarkletCode += `})();`;

    document.getElementById("bookmarkletOutput").value = bookmarkletCode;
    document.getElementById("output").style.display = "block";
}

function copyBookmarklet() {
    const bookmarkletOutput = document.getElementById("bookmarkletOutput");
    bookmarkletOutput.select();
    document.execCommand("copy");
    alert("Bookmarklet đã được sao chép!");
}
