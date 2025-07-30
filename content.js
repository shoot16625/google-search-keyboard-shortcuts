let focusedIndex = -1;

function getLinks() {
	const links = Array.from(document.querySelectorAll("#rso a")).filter(
		(link) => {
			if (!link.querySelector("h3")) {
				return false;
			}

			// 関連する質問などを除外
			const relatedQuestionContainer = link.closest("[data-initq]");
			if (relatedQuestionContainer) {
				return false;
			}

			return true;
		},
	);

	return links;
}

function focusLink(index) {
	const links = getLinks();
	links.forEach((link) => {
		link.removeAttribute("tabindex");
		const h3 = link.querySelector("h3");
		if (h3) {
			h3.style.textDecoration = "";
			h3.style.textDecorationColor = "";
		}
	});

	if (links[index]) {
		links[index].setAttribute("tabindex", "0");
		links[index].focus();
		const h3 = links[index].querySelector("h3");
		if (h3) {
			h3.style.textDecoration = "underline";
			h3.style.textDecorationColor = "red";
			h3.style.textDecorationThickness = "4px";
		}
		links[index].scrollIntoView({ behavior: "smooth", block: "center" });
		focusedIndex = index;
	}
}

// 検索結果が読み込まれた時に最初のリンクにフォーカス
function initializeFocus() {
	const links = getLinks();
	if (links.length > 0 && focusedIndex === -1) {
		focusLink(0);
	}
}

// DOMの変更を監視して検索結果の読み込みを検出
function observeSearchResults() {
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			// 新しいノードが追加された場合
			if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
				// 検索結果エリアに変更があった場合
				const hasSearchResults = Array.from(mutation.addedNodes).some(
					(node) =>
						node.nodeType === Node.ELEMENT_NODE &&
						(node?.querySelector("#rso") || node.id === "rso"),
				);

				if (hasSearchResults) {
					// 少し遅延を入れて検索結果が完全に読み込まれるのを待つ
					setTimeout(initializeFocus, 100);
				}
			}
		});
	});

	// 検索結果エリアとbody全体を監視
	const searchContainer = document.querySelector("#main") || document.body;
	observer.observe(searchContainer, {
		childList: true,
		subtree: true,
	});

	// 初期読み込み時にも実行
	setTimeout(initializeFocus, 100);
}

document.addEventListener("keydown", (e) => {
	if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
		if (e.key === "Escape") {
			e.target.blur();
		}
		return;
	}

	const links = getLinks();
	switch (e.key) {
		case "j":
			// down
			if (focusedIndex < links.length - 1) focusLink(focusedIndex + 1);
			break;
		case "k":
			// up
			if (focusedIndex > 0) focusLink(focusedIndex - 1);
			break;
		case "h":
			document.querySelector("#pnprev")?.click();
			break;
		case "l":
			document.querySelector("#pnnext")?.click();
			break;
	}
});

// ページ読み込み時に初期化
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", observeSearchResults);
} else {
	observeSearchResults();
}
