// ==UserScript==
// @name         mmdfans一键下载
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在网页上检测视频标签并获取标题和下载链接，点击下载按钮会跳转到视频链接并尝试关闭页面。支持链接-标题键值对的保存和匹配。
// @author       wzj042
// @match        https://mmdfans.net/mmd/*
// @match        https://cdn.mmdlibrary.eu.org/*
// @match        https://cdn.bakabakaxi.eu.org/*
// @match        https://cdn.baka6.eu.org/*
// @match        https://cdn.baka7.eu.org/*
// @match        https://cdn.baka8.eu.org/*
// @grant        none
// ==/UserScript==

// ![使用预览](https://picx.zhimg.com/v2-3c789a08a942a5a39b360572cf54ac20.gif)
(function () {
    'use strict';
    // 如果当前视频使用的cdn不在列表中，可以添加到列表中
    const cdn_list = [
        'https://cdn.mmdlibrary.eu.org/',
        'https://cdn.baka6.eu.org/',
        'https://cdn.bakabakaxi.eu.org',
        'https://cdn.bakabakaxi.eu.org',
        'https://cdn.baka8.eu.org/',
        'https://cdn.mmdlibrary.eu.org/',
        'https://cdn.baka7.eu.org/',
    ]
    // 延迟执行代码，等待视频标签加载完成
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const checkVideoTag = async () => {
        while (true) {
            const videoTag = document.getElementsByClassName('mdui-video-fluid');
            // 获取视频下载链接
                const sourceElement = document.querySelector('video source');
                const downloadLink = sourceElement ? sourceElement.getAttribute('src') : '';

            if (videoTag.length > 0) {
                // 获取视频标题
                const titleElement = document.querySelector('h2.title');
                const title = titleElement ? titleElement.textContent.trim() : '无标题';


                // 创建下载按钮
                const downloadButton = document.createElement('button');
                downloadButton.innerHTML = '下载视频';
                downloadButton.classList.add('mdui-btn', 'mdui-color-theme-accent', 'mdui-ripple');

                downloadButton.onclick = function () {
                    // 检测当前页面开头是否是cdn链接，如果不是，返回并提示手动添加cdn
                    let isCdnLink = false;
                    for (let i = 0; i < cdn_list.length; i++) {
                        if (downloadLink.startsWith(cdn_list[i])) {
                            isCdnLink = true;
                            break;
                        }
                    }
                    if (!isCdnLink) {
                        alert('当前链接不是cdn链接，请手动添加cdn');
                        return;
                    }
                    // 使downloadLink加上title = title参数
                    download(downloadLink + '?title=' + title, title);
                };

                // 将下载按钮添加到页面
                const tagContainer = document.querySelector('.tag-container');
                tagContainer.appendChild(downloadButton);




                break;
            } else {
                // 检测当前页面开头是否是cdn链接，如果是，调用download
                for (let i = 0; i < cdn_list.length; i++) {
                    if (window.location.href.startsWith(cdn_list[i])) {
                        console.log('start download with cdn link');
                        // 尝试从title参数中获取title，无则默认无标题
                        const url = new URL(window.location.href);
                        const title = url.searchParams.get('title') || '无标题';
                        const downloadLink = window.location.href;

                        download(downloadLink, title);
                        break;
                    }
                }
            }

            await delay(1000); // 等待下一次检查
        }
    };

    function download(url, title) {
        const a = document.createElement("a");
        a.download = `[iwara] ${title}.mp4`;
        a.href = url;
        a.click();
        a.remove();

        setTimeout(function () {
            // 尝试调用返回
            window.history.back();
        }, 500);
    }


    checkVideoTag();
})();