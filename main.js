// ==UserScript==
// @name         mmdfans一键下载
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  在网页上检测视频标签并获取标题和下载链接，点击下载按钮会跳转到视频链接下载并尝试返回页面。
// @author       wzj042
// @match        https://mmdfans.net/mmd/*
// @match        https://cdn.mmdlibrary.eu.org/*
// @match        https://cdn.mmdlibrary2.eu.org/*
// @match        https://cdn.mmdlibrary3.eu.org/*
// @match        https://cdn.bakabakaxi.eu.org/*
// @match        https://cdn.baka6.eu.org/*
// @match        https://cdn.baka7.eu.org/*
// @match        https://cdn.baka8.eu.org/*
// @match        https://cdn.baka9.eu.org/*
// @license      MIT
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    // 如果当前视频使用的cdn不在列表中，可以添加到列表中
    const cdn_list = [
        'https://cdn.mmdlibrary.eu.org',
        'https://cdn.mmdlibrary2.eu.org',
        'https://cdn.mmdlibrary3.eu.org',
        'https://cdn.bakabakaxi.eu.org',
        'https://cdn.baka6.eu.org',
        'https://cdn.baka7.eu.org',
        'https://cdn.baka8.eu.org',
        'https://cdn.baka9.eu.org',
    ]
    let downloadFlag = false; // 是否已经下载过，防止重复下载
    // 延迟执行代码，等待视频标签加载完成
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const checkVideoTag = async () => {
        while (true) {
            const videoTag = document.getElementsByClassName('mdui-video-fluid');
            // 获取视频下载链接
            const sourceElement = document.querySelector('video source');
            const downloadLink = sourceElement ? sourceElement.getAttribute('src') : '';
            // 获取视频标题
            const titleElement = document.querySelector('h2.title');
            const title = titleElement ? titleElement.textContent.trim() : '无标题';

            // 获取作者名
            const authorElement = document.querySelector('.tag-container > a > button');
            const authorName = authorElement ? authorElement.textContent.trim() : '无作者';

            if (videoTag.length > 0) {

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
                    download(downloadLink + '?title=' + title + '&author=' + authorName, title, authorName);
                };

                // 将下载按钮添加到页面
                const tagContainer = document.querySelector('.tag-container');
                tagContainer.appendChild(downloadButton);

                // 添加间隔
                const space = document.createElement('span');
                space.innerHTML = '&nbsp;&nbsp;';
                tagContainer.appendChild(space);
                

                // 添加复制cdn链接按钮，点击复制下载链接的baseurl部分
                const copyCdnButton = document.createElement('button');
                copyCdnButton.innerHTML = '复制cdn链接';
                copyCdnButton.classList.add('mdui-btn', 'mdui-color-theme-accent', 'mdui-ripple');

                copyCdnButton.onclick = function () {
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
                    // 复制下载链接的host部分
                    const url = new URL(downloadLink);
                    navigator.clipboard.writeText(url.protocol + '//' + url.host);
                    // 提示复制成功
                    alert('复制成功');

                }

                tagContainer.appendChild(copyCdnButton);

                break;

            } else if (!downloadFlag) {
                // 检测当前页面开头是否是cdn链接，如果是，调用download
                const curUrl = window.location.href
                if (isCdnLink(curUrl)) {
                    const url = new URL(curUrl);
                    const title = url.searchParams.get('title') || '无标题';
                    const author = url.searchParams.get('author') || '无作者';

                    download(curUrl, title, author);
                }
            }

            await delay(1000); // 等待下一次检查
        }
    };

    function isCdnLink(url) {
        for (let i = 0; i < cdn_list.length; i++) {
            if (url.startsWith(cdn_list[i])) {
                return true;
            }
        }
        return false;
    }

    function download(url, title, author) {
        const a = document.createElement("a");
        a.download = `[iwara][${author}] ${title}.mp4`;
        a.href = url;
        a.click();
        a.remove();
        setTimeout(function () {
            // 尝试调用返回
            // 关闭页面(没捋顺，先不关闭了)
            // window.close();
            if (isCdnLink(window.location.href) && downloadFlag) {
                window.history.back();
            }
            downloadFlag = false;
        }, 1100);
        
        downloadFlag = true;
    }


    checkVideoTag();
})();