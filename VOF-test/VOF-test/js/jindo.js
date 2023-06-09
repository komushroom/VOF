/**
 * Jindo2 Framework
 * @version 1.5.3
 * NHN_Library:Jindo-1.5.3;JavaScript Framework;
 */

if (typeof window != "undefined" && typeof window.nhn == "undefined") {
    window.nhn = {};
}
if (typeof window != "undefined") {
    if (typeof window.jindo == "undefined") {
        window.jindo = {};
    }
} else {
    if (!jindo) {
        jindo = {};
    }
}
jindo.$Jindo = function() {
    var cl = arguments.callee;
    var cc = cl._cached;
    if (cc)
        return cc;
    if (!(this instanceof cl))
        return new cl();
    if (!cc)
        cl._cached = this;
    this.version = "1.5.3";
}
jindo.$ = function(sID) {
    var ret = []
      , arg = arguments
      , nArgLeng = arg.length
      , lastArgument = arg[nArgLeng - 1]
      , doc = document
      , el = null;
    var reg = /^<([a-z]+|h[1-5])>$/i;
    var reg2 = /^<([a-z]+|h[1-5])(\s+[^>]+)?>/i;
    if (nArgLeng > 1 && typeof lastArgument != "string" && lastArgument.body) {
        arg = Array.prototype.slice.apply(arg, [0, nArgLeng - 1]);
        doc = lastArgument;
    }
    for (var i = 0; i < nArgLeng; i++) {
        el = arg[i];
        if (typeof el == "string") {
            el = el.replace(/^\s+|\s+$/g, "");
            if (el.indexOf("<") > -1) {
                if (reg.test(el)) {
                    el = doc.createElement(RegExp.$1);
                } else if (reg2.test(el)) {
                    var p = {
                        thead: 'table',
                        tbody: 'table',
                        tr: 'tbody',
                        td: 'tr',
                        dt: 'dl',
                        dd: 'dl',
                        li: 'ul',
                        legend: 'fieldset',
                        option: "select"
                    };
                    var tag = RegExp.$1.toLowerCase();
                    var ele = jindo._createEle(p[tag], el, doc);
                    for (var i = 0, leng = ele.length; i < leng; i++) {
                        ret.push(ele[i]);
                    }
                    ;el = null;
                }
            } else {
                el = doc.getElementById(el);
            }
        }
        if (el)
            ret[ret.length] = el;
    }
    return ret.length > 1 ? ret : (ret[0] || null);
}
jindo._createEle = function(sParentTag, sHTML, oDoc, bWantParent) {
    var sId = 'R' + new Date().getTime() + parseInt(Math.random() * 100000, 10);
    var oDummy = oDoc.createElement("div");
    switch (sParentTag) {
    case 'select':
    case 'table':
    case 'dl':
    case 'ul':
    case 'fieldset':
        oDummy.innerHTML = '<' + sParentTag + ' class="' + sId + '">' + sHTML + '</' + sParentTag + '>';
        break;
    case 'thead':
    case 'tbody':
    case 'col':
        oDummy.innerHTML = '<table><' + sParentTag + ' class="' + sId + '">' + sHTML + '</' + sParentTag + '></table>';
        break;
    case 'tr':
        oDummy.innerHTML = '<table><tbody><tr class="' + sId + '">' + sHTML + '</tr></tbody></table>';
        break;
    default:
        oDummy.innerHTML = '<div class="' + sId + '">' + sHTML + '</div>';
        break;
    }
    var oFound;
    for (oFound = oDummy.firstChild; oFound; oFound = oFound.firstChild) {
        if (oFound.className == sId)
            break;
    }
    return bWantParent ? oFound : oFound.childNodes;
}
jindo.$Class = function(oDef) {
    function typeClass() {
        var t = this;
        var a = [];
        var superFunc = function(m, superClass, func) {
            if (m != 'constructor' && func.toString().indexOf("$super") > -1) {
                var funcArg = func.toString().replace(/function\s*\(([^\)]*)[\w\W]*/g, "$1").split(",");
                var funcStr = func.toString().replace(/function[^{]*{/, "").replace(/(\w|\.?)(this\.\$super|this)/g, function(m, m2, m3) {
                    if (!m2) {
                        return m3 + ".$super"
                    }
                    return m;
                });
                funcStr = funcStr.substr(0, funcStr.length - 1);
                func = superClass[m] = eval("false||function(" + funcArg.join(",") + "){" + funcStr + "}");
            }
            return function() {
                var f = this.$this[m];
                var t = this.$this;
                var r = (t[m] = func).apply(t, arguments);
                t[m] = f;
                return r;
            }
            ;
        }
        while (typeof t._$superClass != "undefined") {
            t.$super = new Object;
            t.$super.$this = this;
            for (var x in t._$superClass.prototype) {
                if (t._$superClass.prototype.hasOwnProperty(x)) {
                    if (typeof this[x] == "undefined" && x != "$init")
                        this[x] = t._$superClass.prototype[x];
                    if (x != 'constructor' && x != '_$superClass' && typeof t._$superClass.prototype[x] == "function") {
                        t.$super[x] = superFunc(x, t._$superClass, t._$superClass.prototype[x]);
                    } else {
                        t.$super[x] = t._$superClass.prototype[x];
                    }
                }
            }
            if (typeof t.$super.$init == "function")
                a[a.length] = t;
            t = t.$super;
        }
        for (var i = a.length - 1; i > -1; i--)
            a[i].$super.$init.apply(a[i].$super, arguments);
        if (typeof this.$init == "function")
            this.$init.apply(this, arguments);
    }
    if (typeof oDef.$static != "undefined") {
        var i = 0, x;
        for (x in oDef) {
            if (oDef.hasOwnProperty(x)) {
                x == "$static" || i++;
            }
        }
        for (x in oDef.$static) {
            if (oDef.$static.hasOwnProperty(x)) {
                typeClass[x] = oDef.$static[x];
            }
        }
        if (!i)
            return oDef.$static;
        delete oDef.$static;
    }
    typeClass.prototype = oDef;
    typeClass.prototype.constructor = typeClass;
    typeClass.extend = jindo.$Class.extend;
    return typeClass;
}
jindo.$Class.extend = function(superClass) {
    if (typeof superClass == "undefined" || superClass === null || !superClass.extend) {
        throw new Error("extend시 슈퍼 클래스는 Class여야 합니다.");
    }
    this.prototype._$superClass = superClass;
    for (var x in superClass) {
        if (superClass.hasOwnProperty(x)) {
            if (x == "prototype")
                continue;
            this[x] = superClass[x];
        }
    }
    return this;
}
;
jindo.$$ = jindo.cssquery = (function() {
    var sVersion = '3.0';
    var debugOption = {
        repeat: 1
    };
    var UID = 1;
    var cost = 0;
    var validUID = {};
    var bSupportByClassName = document.getElementsByClassName ? true : false;
    var safeHTML = false;
    var getUID4HTML = function(oEl) {
        var nUID = safeHTML ? (oEl._cssquery_UID && oEl._cssquery_UID[0]) : oEl._cssquery_UID;
        if (nUID && validUID[nUID] == oEl)
            return nUID;
        nUID = UID++;
        oEl._cssquery_UID = safeHTML ? [nUID] : nUID;
        validUID[nUID] = oEl;
        return nUID;
    };
    var getUID4XML = function(oEl) {
        var oAttr = oEl.getAttribute('_cssquery_UID');
        var nUID = safeHTML ? (oAttr && oAttr[0]) : oAttr;
        if (!nUID) {
            nUID = UID++;
            oEl.setAttribute('_cssquery_UID', safeHTML ? [nUID] : nUID);
        }
        return nUID;
    };
    var getUID = getUID4HTML;
    var uniqid = function(sPrefix) {
        return (sPrefix || '') + new Date().getTime() + parseInt(Math.random() * 100000000, 10);
    };
    function getElementsByClass(searchClass, node, tag) {
        var classElements = new Array();
        if (node == null)
            node = document;
        if (tag == null)
            tag = '*';
        var els = node.getElementsByTagName(tag);
        var elsLen = els.length;
        var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
        for (i = 0,
        j = 0; i < elsLen; i++) {
            if (pattern.test(els[i].className)) {
                classElements[j] = els[i];
                j++;
            }
        }
        return classElements;
    }
    var getChilds_dontShrink = function(oEl, sTagName, sClassName) {
        if (bSupportByClassName && sClassName) {
            if (oEl.getElementsByClassName)
                return oEl.getElementsByClassName(sClassName);
            if (oEl.querySelectorAll)
                return oEl.querySelectorAll(sClassName);
            return getElementsByClass(sClassName, oEl, sTagName);
        } else if (sTagName == '*') {
            return oEl.all || oEl.getElementsByTagName(sTagName);
        }
        return oEl.getElementsByTagName(sTagName);
    };
    var clearKeys = function() {
        backupKeys._keys = {};
    };
    var oDocument_dontShrink = document;
    var bXMLDocument = false;
    var backupKeys = function(sQuery) {
        var oKeys = backupKeys._keys;
        sQuery = sQuery.replace(/'(\\'|[^'])*'/g, function(sAll) {
            var uid = uniqid('QUOT');
            oKeys[uid] = sAll;
            return uid;
        });
        sQuery = sQuery.replace(/"(\\"|[^"])*"/g, function(sAll) {
            var uid = uniqid('QUOT');
            oKeys[uid] = sAll;
            return uid;
        });
        sQuery = sQuery.replace(/\[(.*?)\]/g, function(sAll, sBody) {
            if (sBody.indexOf('ATTR') == 0)
                return sAll;
            var uid = '[' + uniqid('ATTR') + ']';
            oKeys[uid] = sAll;
            return uid;
        });
        var bChanged;
        do {
            bChanged = false;
            sQuery = sQuery.replace(/\(((\\\)|[^)|^(])*)\)/g, function(sAll, sBody) {
                if (sBody.indexOf('BRCE') == 0)
                    return sAll;
                var uid = '_' + uniqid('BRCE');
                oKeys[uid] = sAll;
                bChanged = true;
                return uid;
            });
        } while (bChanged);
        return sQuery;
    };
    var restoreKeys = function(sQuery, bOnlyAttrBrace) {
        var oKeys = backupKeys._keys;
        var bChanged;
        var rRegex = bOnlyAttrBrace ? /(\[ATTR[0-9]+\])/g : /(QUOT[0-9]+|\[ATTR[0-9]+\])/g;
        do {
            bChanged = false;
            sQuery = sQuery.replace(rRegex, function(sKey) {
                if (oKeys[sKey]) {
                    bChanged = true;
                    return oKeys[sKey];
                }
                return sKey;
            });
        } while (bChanged);
        sQuery = sQuery.replace(/_BRCE[0-9]+/g, function(sKey) {
            return oKeys[sKey] ? oKeys[sKey] : sKey;
        });
        return sQuery;
    };
    var restoreString = function(sKey) {
        var oKeys = backupKeys._keys;
        var sOrg = oKeys[sKey];
        if (!sOrg)
            return sKey;
        return eval(sOrg);
    };
    var wrapQuot = function(sStr) {
        return '"' + sStr.replace(/"/g, '\\"') + '"';
    };
    var getStyleKey = function(sKey) {
        if (/^@/.test(sKey))
            return sKey.substr(1);
        return null;
    };
    var getCSS = function(oEl, sKey) {
        if (oEl.currentStyle) {
            if (sKey == "float")
                sKey = "styleFloat";
            return oEl.currentStyle[sKey] || oEl.style[sKey];
        } else if (window.getComputedStyle) {
            return oDocument_dontShrink.defaultView.getComputedStyle(oEl, null).getPropertyValue(sKey.replace(/([A-Z])/g, "-$1").toLowerCase()) || oEl.style[sKey];
        }
        if (sKey == "float" && /MSIE/.test(window.navigator.userAgent))
            sKey = "styleFloat";
        return oEl.style[sKey];
    };
    var oCamels = {
        'accesskey': 'accessKey',
        'cellspacing': 'cellSpacing',
        'cellpadding': 'cellPadding',
        'class': 'className',
        'colspan': 'colSpan',
        'for': 'htmlFor',
        'maxlength': 'maxLength',
        'readonly': 'readOnly',
        'rowspan': 'rowSpan',
        'tabindex': 'tabIndex',
        'valign': 'vAlign'
    };
    var getDefineCode = function(sKey) {
        var sVal;
        var sStyleKey;
        if (bXMLDocument) {
            sVal = 'oEl.getAttribute("' + sKey + '",2)';
        } else {
            if (sStyleKey = getStyleKey(sKey)) {
                sKey = '$$' + sStyleKey;
                sVal = 'getCSS(oEl, "' + sStyleKey + '")';
            } else {
                switch (sKey) {
                case 'checked':
                    sVal = 'oEl.checked + ""';
                    break;
                case 'disabled':
                    sVal = 'oEl.disabled + ""';
                    break;
                case 'enabled':
                    sVal = '!oEl.disabled + ""';
                    break;
                case 'readonly':
                    sVal = 'oEl.readOnly + ""';
                    break;
                case 'selected':
                    sVal = 'oEl.selected + ""';
                    break;
                default:
                    if (oCamels[sKey]) {
                        sVal = 'oEl.' + oCamels[sKey];
                    } else {
                        sVal = 'oEl.getAttribute("' + sKey + '",2)';
                    }
                }
            }
        }
        return '_' + sKey + ' = ' + sVal;
    };
    var getReturnCode = function(oExpr) {
        var sStyleKey = getStyleKey(oExpr.key);
        var sVar = '_' + (sStyleKey ? '$$' + sStyleKey : oExpr.key);
        var sVal = oExpr.val ? wrapQuot(oExpr.val) : '';
        switch (oExpr.op) {
        case '~=':
            return '(' + sVar + ' && (" " + ' + sVar + ' + " ").indexOf(" " + ' + sVal + ' + " ") > -1)';
        case '^=':
            return '(' + sVar + ' && ' + sVar + '.indexOf(' + sVal + ') == 0)';
        case '$=':
            return '(' + sVar + ' && ' + sVar + '.substr(' + sVar + '.length - ' + oExpr.val.length + ') == ' + sVal + ')';
        case '*=':
            return '(' + sVar + ' && ' + sVar + '.indexOf(' + sVal + ') > -1)';
        case '!=':
            return '(' + sVar + ' != ' + sVal + ')';
        case '=':
            return '(' + sVar + ' == ' + sVal + ')';
        }
        return '(' + sVar + ')';
    };
    var getNodeIndex = function(oEl) {
        var nUID = getUID(oEl);
        var nIndex = oNodeIndexes[nUID] || 0;
        if (nIndex == 0) {
            for (var oSib = (oEl.parentNode || oEl._IE5_parentNode).firstChild; oSib; oSib = oSib.nextSibling) {
                if (oSib.nodeType != 1) {
                    continue;
                }
                nIndex++;
                setNodeIndex(oSib, nIndex);
            }
            nIndex = oNodeIndexes[nUID];
        }
        return nIndex;
    };
    var oNodeIndexes = {};
    var setNodeIndex = function(oEl, nIndex) {
        var nUID = getUID(oEl);
        oNodeIndexes[nUID] = nIndex;
    };
    var unsetNodeIndexes = function() {
        setTimeout(function() {
            oNodeIndexes = {};
        }, 0);
    };
    var oPseudoes_dontShrink = {
        'contains': function(oEl, sOption) {
            return (oEl.innerText || oEl.textContent || '').indexOf(sOption) > -1;
        },
        'last-child': function(oEl, sOption) {
            for (oEl = oEl.nextSibling; oEl; oEl = oEl.nextSibling) {
                if (oEl.nodeType == 1)
                    return false;
            }
            return true;
        },
        'first-child': function(oEl, sOption) {
            for (oEl = oEl.previousSibling; oEl; oEl = oEl.previousSibling) {
                if (oEl.nodeType == 1)
                    return false;
            }
            return true;
        },
        'only-child': function(oEl, sOption) {
            var nChild = 0;
            for (var oChild = (oEl.parentNode || oEl._IE5_parentNode).firstChild; oChild; oChild = oChild.nextSibling) {
                if (oChild.nodeType == 1)
                    nChild++;
                if (nChild > 1)
                    return false;
            }
            return nChild ? true : false;
        },
        'empty': function(oEl, _) {
            return oEl.firstChild ? false : true;
        },
        'nth-child': function(oEl, nMul, nAdd) {
            var nIndex = getNodeIndex(oEl);
            return nIndex % nMul == nAdd;
        },
        'nth-last-child': function(oEl, nMul, nAdd) {
            var oLast = (oEl.parentNode || oEl._IE5_parentNode).lastChild;
            for (; oLast; oLast = oLast.previousSibling) {
                if (oLast.nodeType == 1)
                    break;
            }
            var nTotal = getNodeIndex(oLast);
            var nIndex = getNodeIndex(oEl);
            var nLastIndex = nTotal - nIndex + 1;
            return nLastIndex % nMul == nAdd;
        },
        'checked': function(oEl) {
            return !!oEl.checked;
        },
        'selected': function(oEl) {
            return !!oEl.selected;
        },
        'enabled': function(oEl) {
            return !oEl.disabled;
        },
        'disabled': function(oEl) {
            return !!oEl.disabled;
        }
    };
    var getExpression = function(sBody) {
        var oRet = {
            defines: '',
            returns: 'true'
        };
        var sBody = restoreKeys(sBody, true);
        var aExprs = [];
        var aDefineCode = []
          , aReturnCode = [];
        var sId, sTagName;
        var sBody = sBody.replace(/:([\w-]+)(\(([^)]*)\))?/g, function(_1, sType, _2, sOption) {
            switch (sType) {
            case 'not':
                var oInner = getExpression(sOption);
                var sFuncDefines = oInner.defines;
                var sFuncReturns = oInner.returnsID + oInner.returnsTAG + oInner.returns;
                aReturnCode.push('!(function() { ' + sFuncDefines + ' return ' + sFuncReturns + ' })()');
                break;
            case 'nth-child':
            case 'nth-last-child':
                sOption = restoreString(sOption);
                if (sOption == 'even') {
                    sOption = '2n';
                } else if (sOption == 'odd') {
                    sOption = '2n+1';
                }
                var nMul, nAdd;
                var matchstr = sOption.match(/([0-9]*)n([+-][0-9]+)*/);
                if (matchstr) {
                    nMul = matchstr[1] || 1;
                    nAdd = matchstr[2] || 0;
                } else {
                    nMul = Infinity;
                    nAdd = parseInt(sOption, 10);
                }
                aReturnCode.push('oPseudoes_dontShrink[' + wrapQuot(sType) + '](oEl, ' + nMul + ', ' + nAdd + ')');
                break;
            case 'first-of-type':
            case 'last-of-type':
                sType = (sType == 'first-of-type' ? 'nth-of-type' : 'nth-last-of-type');
                sOption = 1;
            case 'nth-of-type':
            case 'nth-last-of-type':
                sOption = restoreString(sOption);
                if (sOption == 'even') {
                    sOption = '2n';
                } else if (sOption == 'odd') {
                    sOption = '2n+1';
                }
                var nMul, nAdd;
                if (/([0-9]*)n([+-][0-9]+)*/.test(sOption)) {
                    nMul = parseInt(RegExp.$1, 10) || 1;
                    nAdd = parseInt(RegExp.$2, 20) || 0;
                } else {
                    nMul = Infinity;
                    nAdd = parseInt(sOption, 10);
                }
                oRet.nth = [nMul, nAdd, sType];
                break;
            default:
                sOption = sOption ? restoreString(sOption) : '';
                aReturnCode.push('oPseudoes_dontShrink[' + wrapQuot(sType) + '](oEl, ' + wrapQuot(sOption) + ')');
                break;
            }
            return '';
        });
        var sBody = sBody.replace(/\[(@?[\w-]+)(([!^~$*]?=)([^\]]*))?\]/g, function(_1, sKey, _2, sOp, sVal) {
            sKey = restoreString(sKey);
            sVal = restoreString(sVal);
            if (sKey == 'checked' || sKey == 'disabled' || sKey == 'enabled' || sKey == 'readonly' || sKey == 'selected') {
                if (!sVal) {
                    sOp = '=';
                    sVal = 'true';
                }
            }
            aExprs.push({
                key: sKey,
                op: sOp,
                val: sVal
            });
            return '';
        });
        var sClassName = null;
        var sBody = sBody.replace(/\.([\w-]+)/g, function(_, sClass) {
            aExprs.push({
                key: 'class',
                op: '~=',
                val: sClass
            });
            if (!sClassName)
                sClassName = sClass;
            return '';
        });
        var sBody = sBody.replace(/#([\w-]+)/g, function(_, sIdValue) {
            if (bXMLDocument) {
                aExprs.push({
                    key: 'id',
                    op: '=',
                    val: sIdValue
                });
            } else {
                sId = sIdValue;
            }
            return '';
        });
        sTagName = sBody == '*' ? '' : sBody;
        var oVars = {};
        for (var i = 0, oExpr; oExpr = aExprs[i]; i++) {
            var sKey = oExpr.key;
            if (!oVars[sKey])
                aDefineCode.push(getDefineCode(sKey));
            aReturnCode.unshift(getReturnCode(oExpr));
            oVars[sKey] = true;
        }
        if (aDefineCode.length)
            oRet.defines = 'var ' + aDefineCode.join(',') + ';';
        if (aReturnCode.length)
            oRet.returns = aReturnCode.join('&&');
        oRet.quotID = sId ? wrapQuot(sId) : '';
        oRet.quotTAG = sTagName ? wrapQuot(bXMLDocument ? sTagName : sTagName.toUpperCase()) : '';
        if (bSupportByClassName)
            oRet.quotCLASS = sClassName ? wrapQuot(sClassName) : '';
        oRet.returnsID = sId ? 'oEl.id == ' + oRet.quotID + ' && ' : '';
        oRet.returnsTAG = sTagName && sTagName != '*' ? 'oEl.tagName == ' + oRet.quotTAG + ' && ' : '';
        return oRet;
    };
    var splitToParts = function(sQuery) {
        var aParts = [];
        var sRel = ' ';
        var sBody = sQuery.replace(/(.*?)\s*(!?[+>~ ]|!)\s*/g, function(_, sBody, sRelative) {
            if (sBody)
                aParts.push({
                    rel: sRel,
                    body: sBody
                });
            sRel = sRelative.replace(/\s+$/g, '') || ' ';
            return '';
        });
        if (sBody)
            aParts.push({
                rel: sRel,
                body: sBody
            });
        return aParts;
    };
    var isNth_dontShrink = function(oEl, sTagName, nMul, nAdd, sDirection) {
        var nIndex = 0;
        for (var oSib = oEl; oSib; oSib = oSib[sDirection]) {
            if (oSib.nodeType == 1 && (!sTagName || sTagName == oSib.tagName))
                nIndex++;
        }
        return nIndex % nMul == nAdd;
    };
    var compileParts = function(aParts) {
        var aPartExprs = [];
        for (var i = 0, oPart; oPart = aParts[i]; i++)
            aPartExprs.push(getExpression(oPart.body));
        var sFunc = '';
        var sPushCode = 'aRet.push(oEl); if (oOptions.single) { bStop = true; }';
        for (var i = aParts.length - 1, oPart; oPart = aParts[i]; i--) {
            var oExpr = aPartExprs[i];
            var sPush = (debugOption.callback ? 'cost++;' : '') + oExpr.defines;
            var sReturn = 'if (bStop) {' + (i == 0 ? 'return aRet;' : 'return;') + '}';
            if (oExpr.returns == 'true') {
                sPush += (sFunc ? sFunc + '(oEl);' : sPushCode) + sReturn;
            } else {
                sPush += 'if (' + oExpr.returns + ') {' + (sFunc ? sFunc + '(oEl);' : sPushCode) + sReturn + '}';
            }
            var sCheckTag = 'oEl.nodeType != 1';
            if (oExpr.quotTAG)
                sCheckTag = 'oEl.tagName != ' + oExpr.quotTAG;
            var sTmpFunc = '(function(oBase' + (i == 0 ? ', oOptions) { var bStop = false; var aRet = [];' : ') {');
            if (oExpr.nth) {
                sPush = 'if (isNth_dontShrink(oEl, ' + (oExpr.quotTAG ? oExpr.quotTAG : 'false') + ',' + oExpr.nth[0] + ',' + oExpr.nth[1] + ',' + '"' + (oExpr.nth[2] == 'nth-of-type' ? 'previousSibling' : 'nextSibling') + '")) {' + sPush + '}';
            }
            switch (oPart.rel) {
            case ' ':
                if (oExpr.quotID) {
                    sTmpFunc += 'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' + 'var oCandi = oEl;' + 'for (; oCandi; oCandi = (oCandi.parentNode || oCandi._IE5_parentNode)) {' + 'if (oCandi == oBase) break;' + '}' + 'if (!oCandi || ' + sCheckTag + ') return aRet;' + sPush;
                } else {
                    sTmpFunc += 'var aCandi = getChilds_dontShrink(oBase, ' + (oExpr.quotTAG || '"*"') + ', ' + (oExpr.quotCLASS || 'null') + ');' + 'for (var i = 0, oEl; oEl = aCandi[i]; i++) {' + (oExpr.quotCLASS ? 'if (' + sCheckTag + ') continue;' : '') + sPush + '}';
                }
                break;
            case '>':
                if (oExpr.quotID) {
                    sTmpFunc += 'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' + 'if ((oEl.parentNode || oEl._IE5_parentNode) != oBase || ' + sCheckTag + ') return aRet;' + sPush;
                } else {
                    sTmpFunc += 'for (var oEl = oBase.firstChild; oEl; oEl = oEl.nextSibling) {' + 'if (' + sCheckTag + ') { continue; }' + sPush + '}';
                }
                break;
            case '+':
                if (oExpr.quotID) {
                    sTmpFunc += 'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' + 'var oPrev;' + 'for (oPrev = oEl.previousSibling; oPrev; oPrev = oPrev.previousSibling) { if (oPrev.nodeType == 1) break; }' + 'if (!oPrev || oPrev != oBase || ' + sCheckTag + ') return aRet;' + sPush;
                } else {
                    sTmpFunc += 'for (var oEl = oBase.nextSibling; oEl; oEl = oEl.nextSibling) { if (oEl.nodeType == 1) break; }' + 'if (!oEl || ' + sCheckTag + ') { return aRet; }' + sPush;
                }
                break;
            case '~':
                if (oExpr.quotID) {
                    sTmpFunc += 'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' + 'var oCandi = oEl;' + 'for (; oCandi; oCandi = oCandi.previousSibling) { if (oCandi == oBase) break; }' + 'if (!oCandi || ' + sCheckTag + ') return aRet;' + sPush;
                } else {
                    sTmpFunc += 'for (var oEl = oBase.nextSibling; oEl; oEl = oEl.nextSibling) {' + 'if (' + sCheckTag + ') { continue; }' + 'if (!markElement_dontShrink(oEl, ' + i + ')) { break; }' + sPush + '}';
                }
                break;
            case '!':
                if (oExpr.quotID) {
                    sTmpFunc += 'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' + 'for (; oBase; oBase = (oBase.parentNode || oBase._IE5_parentNode)) { if (oBase == oEl) break; }' + 'if (!oBase || ' + sCheckTag + ') return aRet;' + sPush;
                } else {
                    sTmpFunc += 'for (var oEl = (oBase.parentNode || oBase._IE5_parentNode); oEl; oEl = (oEl.parentNode || oEl._IE5_parentNode)) {' + 'if (' + sCheckTag + ') { continue; }' + sPush + '}';
                }
                break;
            case '!>':
                if (oExpr.quotID) {
                    sTmpFunc += 'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' + 'var oRel = (oBase.parentNode || oBase._IE5_parentNode);' + 'if (!oRel || oEl != oRel || (' + sCheckTag + ')) return aRet;' + sPush;
                } else {
                    sTmpFunc += 'var oEl = (oBase.parentNode || oBase._IE5_parentNode);' + 'if (!oEl || ' + sCheckTag + ') { return aRet; }' + sPush;
                }
                break;
            case '!+':
                if (oExpr.quotID) {
                    sTmpFunc += 'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' + 'var oRel;' + 'for (oRel = oBase.previousSibling; oRel; oRel = oRel.previousSibling) { if (oRel.nodeType == 1) break; }' + 'if (!oRel || oEl != oRel || (' + sCheckTag + ')) return aRet;' + sPush;
                } else {
                    sTmpFunc += 'for (oEl = oBase.previousSibling; oEl; oEl = oEl.previousSibling) { if (oEl.nodeType == 1) break; }' + 'if (!oEl || ' + sCheckTag + ') { return aRet; }' + sPush;
                }
                break;
            case '!~':
                if (oExpr.quotID) {
                    sTmpFunc += 'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' + 'var oRel;' + 'for (oRel = oBase.previousSibling; oRel; oRel = oRel.previousSibling) { ' + 'if (oRel.nodeType != 1) { continue; }' + 'if (oRel == oEl) { break; }' + '}' + 'if (!oRel || (' + sCheckTag + ')) return aRet;' + sPush;
                } else {
                    sTmpFunc += 'for (oEl = oBase.previousSibling; oEl; oEl = oEl.previousSibling) {' + 'if (' + sCheckTag + ') { continue; }' + 'if (!markElement_dontShrink(oEl, ' + i + ')) { break; }' + sPush + '}';
                }
                break;
            }
            sTmpFunc += (i == 0 ? 'return aRet;' : '') + '})';
            sFunc = sTmpFunc;
        }
        eval('var fpCompiled = ' + sFunc + ';');
        return fpCompiled;
    };
    var parseQuery = function(sQuery) {
        var sCacheKey = sQuery;
        var fpSelf = arguments.callee;
        var fpFunction = fpSelf._cache[sCacheKey];
        if (!fpFunction) {
            sQuery = backupKeys(sQuery);
            var aParts = splitToParts(sQuery);
            fpFunction = fpSelf._cache[sCacheKey] = compileParts(aParts);
            fpFunction.depth = aParts.length;
        }
        return fpFunction;
    };
    parseQuery._cache = {};
    var parseTestQuery = function(sQuery) {
        var fpSelf = arguments.callee;
        var aSplitQuery = backupKeys(sQuery).split(/\s*,\s*/);
        var aResult = [];
        var nLen = aSplitQuery.length;
        var aFunc = [];
        for (var i = 0; i < nLen; i++) {
            aFunc.push((function(sQuery) {
                var sCacheKey = sQuery;
                var fpFunction = fpSelf._cache[sCacheKey];
                if (!fpFunction) {
                    sQuery = backupKeys(sQuery);
                    var oExpr = getExpression(sQuery);
                    eval('fpFunction = function(oEl) { ' + oExpr.defines + 'return (' + oExpr.returnsID + oExpr.returnsTAG + oExpr.returns + '); };');
                }
                return fpFunction;
            }
            )(restoreKeys(aSplitQuery[i])));
        }
        return aFunc;
    };
    parseTestQuery._cache = {};
    var distinct = function(aList) {
        var aDistinct = [];
        var oDummy = {};
        for (var i = 0, oEl; oEl = aList[i]; i++) {
            var nUID = getUID(oEl);
            if (oDummy[nUID])
                continue;
            aDistinct.push(oEl);
            oDummy[nUID] = true;
        }
        return aDistinct;
    };
    var markElement_dontShrink = function(oEl, nDepth) {
        var nUID = getUID(oEl);
        if (cssquery._marked[nDepth][nUID])
            return false;
        cssquery._marked[nDepth][nUID] = true;
        return true;
    };
    var oResultCache = null;
    var bUseResultCache = false;
    var bExtremeMode = false;
    var old_cssquery = function(sQuery, oParent, oOptions) {
        if (typeof sQuery == 'object') {
            var oResult = {};
            for (var k in sQuery) {
                if (sQuery.hasOwnProperty(k))
                    oResult[k] = arguments.callee(sQuery[k], oParent, oOptions);
            }
            return oResult;
        }
        cost = 0;
        var executeTime = new Date().getTime();
        var aRet;
        for (var r = 0, rp = debugOption.repeat; r < rp; r++) {
            aRet = (function(sQuery, oParent, oOptions) {
                if (oOptions) {
                    if (!oOptions.oneTimeOffCache) {
                        oOptions.oneTimeOffCache = false;
                    }
                } else {
                    oOptions = {
                        oneTimeOffCache: false
                    };
                }
                cssquery.safeHTML(oOptions.oneTimeOffCache);
                if (!oParent)
                    oParent = document;
                oDocument_dontShrink = oParent.ownerDocument || oParent.document || oParent;
                if (/\bMSIE\s([0-9]+(\.[0-9]+)*);/.test(navigator.userAgent) && parseFloat(RegExp.$1) < 6) {
                    try {
                        oDocument_dontShrink.location;
                    } catch (e) {
                        oDocument_dontShrink = document;
                    }
                    oDocument_dontShrink.firstChild = oDocument_dontShrink.getElementsByTagName('html')[0];
                    oDocument_dontShrink.firstChild._IE5_parentNode = oDocument_dontShrink;
                }
                bXMLDocument = (typeof XMLDocument != 'undefined') ? (oDocument_dontShrink.constructor === XMLDocument) : (!oDocument_dontShrink.location);
                getUID = bXMLDocument ? getUID4XML : getUID4HTML;
                clearKeys();
                var aSplitQuery = backupKeys(sQuery).split(/\s*,\s*/);
                var aResult = [];
                var nLen = aSplitQuery.length;
                for (var i = 0; i < nLen; i++)
                    aSplitQuery[i] = restoreKeys(aSplitQuery[i]);
                for (var i = 0; i < nLen; i++) {
                    var sSingleQuery = aSplitQuery[i];
                    var aSingleQueryResult = null;
                    var sResultCacheKey = sSingleQuery + (oOptions.single ? '_single' : '');
                    var aCache = bUseResultCache ? oResultCache[sResultCacheKey] : null;
                    if (aCache) {
                        for (var j = 0, oCache; oCache = aCache[j]; j++) {
                            if (oCache.parent == oParent) {
                                aSingleQueryResult = oCache.result;
                                break;
                            }
                        }
                    }
                    if (!aSingleQueryResult) {
                        var fpFunction = parseQuery(sSingleQuery);
                        cssquery._marked = [];
                        for (var j = 0, nDepth = fpFunction.depth; j < nDepth; j++)
                            cssquery._marked.push({});
                        aSingleQueryResult = distinct(fpFunction(oParent, oOptions));
                        if (bUseResultCache && !oOptions.oneTimeOffCache) {
                            if (!(oResultCache[sResultCacheKey]instanceof Array))
                                oResultCache[sResultCacheKey] = [];
                            oResultCache[sResultCacheKey].push({
                                parent: oParent,
                                result: aSingleQueryResult
                            });
                        }
                    }
                    aResult = aResult.concat(aSingleQueryResult);
                }
                unsetNodeIndexes();
                return aResult;
            }
            )(sQuery, oParent, oOptions);
        }
        executeTime = new Date().getTime() - executeTime;
        if (debugOption.callback)
            debugOption.callback(sQuery, cost, executeTime);
        return aRet;
    };
    var cssquery;
    if (document.querySelectorAll) {
        function _isNonStandardQueryButNotException(sQuery) {
            return /\[\s*(?:checked|selected|disabled)/.test(sQuery)
        }
        function _commaRevise(sQuery, sChange) {
            return sQuery.replace(/\,/gi, sChange);
        }
        var protoSlice = Array.prototype.slice;
        var _toArray = function(aArray) {
            return protoSlice.apply(aArray);
        }
        try {
            protoSlice.apply(document.documentElement.childNodes);
        } catch (e) {
            _toArray = function(aArray) {
                var returnArray = [];
                var leng = aArray.length;
                for (var i = 0; i < leng; i++) {
                    returnArray.push(aArray[i]);
                }
                return returnArray;
            }
        }
        cssquery = function(sQuery, oParent, oOptions) {
            oParent = oParent || document;
            try {
                if (_isNonStandardQueryButNotException(sQuery)) {
                    throw Error("None Standard Query");
                } else {
                    var sReviseQuery = sQuery;
                    var oReviseParent = oParent;
                    if (oParent.nodeType != 9) {
                        if (bExtremeMode) {
                            if (!oParent.id)
                                oParent.id = "p" + new Date().getTime() + parseInt(Math.random() * 100000000, 10);
                        } else {
                            throw Error("Parent Element has not ID.or It is not document.or None Extreme Mode.");
                        }
                        sReviseQuery = _commaRevise("#" + oParent.id + " " + sQuery, ", #" + oParent.id);
                        oReviseParent = oParent.ownerDocument || oParent.document || document;
                    }
                    if (oOptions && oOptions.single) {
                        return [oReviseParent.querySelector(sReviseQuery)];
                    } else {
                        return _toArray(oReviseParent.querySelectorAll(sReviseQuery));
                    }
                }
            } catch (e) {
                return old_cssquery(sQuery, oParent, oOptions);
            }
        }
    } else {
        cssquery = old_cssquery;
    }
    cssquery.test = function(oEl, sQuery) {
        clearKeys();
        var aFunc = parseTestQuery(sQuery);
        for (var i = 0, nLen = aFunc.length; i < nLen; i++) {
            if (aFunc[i](oEl))
                return true;
        }
        return false;
    }
    ;
    cssquery.useCache = function(bFlag) {
        if (typeof bFlag != 'undefined') {
            bUseResultCache = bFlag;
            cssquery.clearCache();
        }
        return bUseResultCache;
    }
    ;
    cssquery.clearCache = function() {
        oResultCache = {};
    }
    ;
    cssquery.getSingle = function(sQuery, oParent, oOptions) {
        return cssquery(sQuery, oParent, {
            single: true,
            oneTimeOffCache: oOptions ? (!!oOptions.oneTimeOffCache) : false
        })[0] || null;
    }
    ;
    cssquery.xpath = function(sXPath, oParent) {
        var sXPath = sXPath.replace(/\/(\w+)(\[([0-9]+)\])?/g, function(_1, sTag, _2, sTh) {
            sTh = sTh || '1';
            return '>' + sTag + ':nth-of-type(' + sTh + ')';
        });
        return old_cssquery(sXPath, oParent);
    }
    ;
    cssquery.debug = function(fpCallback, nRepeat) {
        debugOption.callback = fpCallback;
        debugOption.repeat = nRepeat || 1;
    }
    ;
    cssquery.safeHTML = function(bFlag) {
        var bIE = /MSIE/.test(window.navigator.userAgent);
        if (arguments.length > 0)
            safeHTML = bFlag && bIE;
        return safeHTML || !bIE;
    }
    ;
    cssquery.version = sVersion;
    cssquery.release = function() {
        if (/MSIE/.test(window.navigator.userAgent)) {
            delete validUID;
            validUID = {};
            if (bUseResultCache) {
                cssquery.clearCache();
            }
        }
    }
    ;
    cssquery._getCacheInfo = function() {
        return {
            uidCache: validUID,
            eleCache: oResultCache
        }
    }
    cssquery._resetUID = function() {
        UID = 0
    }
    cssquery.extreme = function(bExtreme) {
        if (arguments.length == 0) {
            bExtreme = true;
        }
        bExtremeMode = bExtreme;
    }
    return cssquery;
}
)();
jindo.$Agent = function() {
    var cl = arguments.callee;
    var cc = cl._cached;
    if (cc)
        return cc;
    if (!(this instanceof cl))
        return new cl;
    if (!cc)
        cl._cached = this;
    this._navigator = navigator;
}
jindo.$Agent.prototype.navigator = function() {
    var info = new Object;
    var ver = -1;
    var nativeVersion = -1;
    var u = this._navigator.userAgent;
    var v = this._navigator.vendor || "";
    function f(s, h) {
        return ((h || "").indexOf(s) > -1)
    }
    ;info.getName = function() {
        var name = "";
        for (x in info) {
            if (typeof info[x] == "boolean" && info[x] && info.hasOwnProperty(x))
                name = x;
        }
        return name;
    }
    info.webkit = f("WebKit", u);
    info.opera = (typeof window.opera != "undefined") || f("Opera", u);
    info.ie = !info.opera && f("MSIE", u);
    info.chrome = info.webkit && f("Chrome", u);
    info.safari = info.webkit && !info.chrome && f("Apple", v);
    info.firefox = f("Firefox", u);
    info.mozilla = f("Gecko", u) && !info.safari && !info.chrome && !info.firefox;
    info.camino = f("Camino", v);
    info.netscape = f("Netscape", u);
    info.omniweb = f("OmniWeb", u);
    info.icab = f("iCab", v);
    info.konqueror = f("KDE", v);
    info.mobile = (f("Mobile", u) || f("Android", u) || f("Nokia", u) || f("webOS", u) || f("Opera Mini", u) || f("BlackBerry", u) || (f("Windows", u) && f("PPC", u)) || f("Smartphone", u) || f("IEMobile", u)) && !f("iPad", u);
    info.msafari = (!f("IEMobile", u) && f("Mobile", u)) || (f("iPad", u) && f("Safari", u));
    info.mopera = f("Opera Mini", u);
    info.mie = f("PPC", u) || f("Smartphone", u) || f("IEMobile", u);
    try {
        if (info.ie) {
            ver = u.match(/(?:MSIE) ([0-9.]+)/)[1];
            if (u.match(/(?:Trident)\/([0-9.]+)/)) {
                var nTridentNum = parseInt(RegExp.$1, 10);
                if (nTridentNum > 3) {
                    nativeVersion = nTridentNum + 4;
                }
            }
        } else if (info.safari || info.msafari) {
            ver = parseFloat(u.match(/Safari\/([0-9.]+)/)[1]);
            if (ver == 100) {
                ver = 1.1;
            } else {
                if (u.match(/Version\/([0-9.]+)/)) {
                    ver = RegExp.$1;
                } else {
                    ver = [1.0, 1.2, -1, 1.3, 2.0, 3.0][Math.floor(ver / 100)];
                }
            }
        } else if (info.mopera) {
            ver = u.match(/(?:Opera\sMini)\/([0-9.]+)/)[1];
        } else if (info.firefox || info.opera || info.omniweb) {
            ver = u.match(/(?:Firefox|Opera|OmniWeb)\/([0-9.]+)/)[1];
        } else if (info.mozilla) {
            ver = u.match(/rv:([0-9.]+)/)[1];
        } else if (info.icab) {
            ver = u.match(/iCab[ \/]([0-9.]+)/)[1];
        } else if (info.chrome) {
            ver = u.match(/Chrome[ \/]([0-9.]+)/)[1];
        }
        info.version = parseFloat(ver);
        info.nativeVersion = parseFloat(nativeVersion);
        if (isNaN(info.version))
            info.version = -1;
    } catch (e) {
        info.version = -1;
    }
    this.navigator = function() {
        return info;
    }
    ;
    return info;
}
;
jindo.$Agent.prototype.os = function() {
    var info = new Object;
    var u = this._navigator.userAgent;
    var p = this._navigator.platform;
    var f = function(s, h) {
        return (h.indexOf(s) > -1)
    };
    info.getName = function() {
        var name = "";
        for (x in info) {
            if (typeof info[x] == "boolean" && info[x] && info.hasOwnProperty(x))
                name = x;
        }
        return name;
    }
    info.win = f("Win", p)
    info.mac = f("Mac", p);
    info.linux = f("Linux", p);
    info.win2000 = info.win && (f("NT 5.0", u) || f("2000", u));
    info.winxp = info.win && f("NT 5.1", u);
    info.xpsp2 = info.winxp && f("SV1", u);
    info.vista = info.win && f("NT 6.0", u);
    info.win7 = info.win && f("NT 6.1", u);
    info.ipad = f("iPad", u);
    info.iphone = f("iPhone", u) && !info.ipad;
    info.android = f("Android", u);
    info.nokia = f("Nokia", u);
    info.webos = f("webOS", u);
    info.blackberry = f("BlackBerry", u);
    info.mwin = f("PPC", u) || f("Smartphone", u) || f("IEMobile", u);
    this.os = function() {
        return info;
    }
    ;
    return info;
}
;
jindo.$Agent.prototype.flash = function() {
    var info = new Object;
    var p = this._navigator.plugins;
    var m = this._navigator.mimeTypes;
    var f = null;
    info.installed = false;
    info.version = -1;
    if (typeof p != "undefined" && p.length) {
        f = p["Shockwave Flash"];
        if (f) {
            info.installed = true;
            if (f.description) {
                info.version = parseFloat(f.description.match(/[0-9.]+/)[0]);
            }
        }
        if (p["Shockwave Flash 2.0"]) {
            info.installed = true;
            info.version = 2;
        }
    } else if (typeof m != "undefined" && m.length) {
        f = m["application/x-shockwave-flash"];
        info.installed = (f && f.enabledPlugin);
    } else {
        for (var i = 10; i > 1; i--) {
            try {
                f = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i);
                info.installed = true;
                info.version = i;
                break;
            } catch (e) {}
        }
    }
    this.flash = function() {
        return info;
    }
    ;
    this.info = this.flash;
    return info;
}
;
jindo.$Agent.prototype.silverlight = function() {
    var info = new Object;
    var p = this._navigator.plugins;
    var s = null;
    info.installed = false;
    info.version = -1;
    if (typeof p != "undefined" && p.length) {
        s = p["Silverlight Plug-In"];
        if (s) {
            info.installed = true;
            info.version = parseInt(s.description.split(".")[0], 10);
            if (s.description == "1.0.30226.2")
                info.version = 2;
        }
    } else {
        try {
            s = new ActiveXObject("AgControl.AgControl");
            info.installed = true;
            if (s.isVersionSupported("3.0")) {
                info.version = 3;
            } else if (s.isVersionSupported("2.0")) {
                info.version = 2;
            } else if (s.isVersionSupported("1.0")) {
                info.version = 1;
            }
        } catch (e) {}
    }
    this.silverlight = function() {
        return info;
    }
    ;
    return info;
}
;
jindo.$A = function(array) {
    var cl = arguments.callee;
    if (typeof array == "undefined" || array == null)
        array = [];
    if (array instanceof cl)
        return array;
    if (!(this instanceof cl))
        return new cl(array);
    this._array = []
    if (array.constructor != String) {
        this._array = [];
        for (var i = 0; i < array.length; i++) {
            this._array[this._array.length] = array[i];
        }
    }
}
;
jindo.$A.prototype.toString = function() {
    return this._array.toString();
}
;
jindo.$A.prototype.get = function(nIndex) {
    return this._array[nIndex];
}
;
jindo.$A.prototype.length = function(nLen, oValue) {
    if (typeof nLen == "number") {
        var l = this._array.length;
        this._array.length = nLen;
        if (typeof oValue != "undefined") {
            for (var i = l; i < nLen; i++) {
                this._array[i] = oValue;
            }
        }
        return this;
    } else {
        return this._array.length;
    }
}
;
jindo.$A.prototype.has = function(oValue) {
    return (this.indexOf(oValue) > -1);
}
;
jindo.$A.prototype.indexOf = function(oValue) {
    if (typeof this._array.indexOf != 'undefined') {
        jindo.$A.prototype.indexOf = function(oValue) {
            return this._array.indexOf(oValue);
        }
    } else {
        jindo.$A.prototype.indexOf = function(oValue) {
            for (var i = 0; i < this._array.length; i++) {
                if (this._array[i] == oValue)
                    return i;
            }
            return -1;
        }
    }
    return this.indexOf(oValue);
}
;
jindo.$A.prototype.$value = function() {
    return this._array;
}
;
jindo.$A.prototype.push = function(oValue1) {
    return this._array.push.apply(this._array, Array.prototype.slice.apply(arguments));
}
;
jindo.$A.prototype.pop = function() {
    return this._array.pop();
}
;
jindo.$A.prototype.shift = function() {
    return this._array.shift();
}
;
jindo.$A.prototype.unshift = function(oValue1) {
    this._array.unshift.apply(this._array, Array.prototype.slice.apply(arguments));
    return this._array.length;
}
;
jindo.$A.prototype.forEach = function(fCallback, oThis) {
    if (typeof this._array.forEach == "function") {
        jindo.$A.prototype.forEach = function(fCallback, oThis) {
            var arr = this._array;
            var errBreak = this.constructor.Break;
            var errContinue = this.constructor.Continue;
            function f(v, i, a) {
                try {
                    fCallback.call(oThis, v, i, a);
                } catch (e) {
                    if (!(e instanceof errContinue))
                        throw e;
                }
            }
            ;try {
                this._array.forEach(f);
            } catch (e) {
                if (!(e instanceof errBreak))
                    throw e;
            }
            return this;
        }
    } else {
        jindo.$A.prototype.forEach = function(fCallback, oThis) {
            var arr = this._array;
            var errBreak = this.constructor.Break;
            var errContinue = this.constructor.Continue;
            function f(v, i, a) {
                try {
                    fCallback.call(oThis, v, i, a);
                } catch (e) {
                    if (!(e instanceof errContinue))
                        throw e;
                }
            }
            ;for (var i = 0; i < arr.length; i++) {
                try {
                    f(arr[i], i, arr);
                } catch (e) {
                    if (e instanceof errBreak)
                        break;
                    throw e;
                }
            }
            return this;
        }
    }
    return this.forEach(fCallback, oThis);
}
;
jindo.$A.prototype.slice = function(nStart, nEnd) {
    var a = this._array.slice.call(this._array, nStart, nEnd);
    return jindo.$A(a);
}
;
jindo.$A.prototype.splice = function(nIndex, nHowMany) {
    var a = this._array.splice.apply(this._array, Array.prototype.slice.apply(arguments));
    return jindo.$A(a);
}
;
jindo.$A.prototype.shuffle = function() {
    this._array.sort(function(a, b) {
        return Math.random() > Math.random() ? 1 : -1
    });
    return this;
}
;
jindo.$A.prototype.reverse = function() {
    this._array.reverse();
    return this;
}
;
jindo.$A.prototype.empty = function() {
    return this.length(0);
}
;
jindo.$A.Break = function() {
    if (!(this instanceof arguments.callee))
        throw new arguments.callee;
}
;
jindo.$A.Continue = function() {
    if (!(this instanceof arguments.callee))
        throw new arguments.callee;
}
;
jindo.$A.prototype.map = function(fCallback, oThis) {
    if (typeof this._array.map == "function") {
        jindo.$A.prototype.map = function(fCallback, oThis) {
            var arr = this._array;
            var errBreak = this.constructor.Break;
            var errContinue = this.constructor.Continue;
            function f(v, i, a) {
                try {
                    return fCallback.call(oThis, v, i, a);
                } catch (e) {
                    if (e instanceof errContinue) {
                        return v;
                    } else {
                        throw e;
                    }
                }
            }
            ;try {
                this._array = this._array.map(f);
            } catch (e) {
                if (!(e instanceof errBreak))
                    throw e;
            }
            return this;
        }
    } else {
        jindo.$A.prototype.map = function(fCallback, oThis) {
            var arr = this._array;
            var returnArr = [];
            var errBreak = this.constructor.Break;
            var errContinue = this.constructor.Continue;
            function f(v, i, a) {
                try {
                    return fCallback.call(oThis, v, i, a);
                } catch (e) {
                    if (e instanceof errContinue) {
                        return v;
                    } else {
                        throw e;
                    }
                }
            }
            ;for (var i = 0; i < this._array.length; i++) {
                try {
                    returnArr[i] = f(arr[i], i, arr);
                } catch (e) {
                    if (e instanceof errBreak) {
                        return this;
                    } else {
                        throw e;
                    }
                }
            }
            this._array = returnArr;
            return this;
        }
    }
    return this.map(fCallback, oThis);
}
;
jindo.$A.prototype.filter = function(fCallback, oThis) {
    if (typeof this._array.filter != "undefined") {
        jindo.$A.prototype.filter = function(fCallback, oThis) {
            return jindo.$A(this._array.filter(fCallback, oThis));
        }
    } else {
        jindo.$A.prototype.filter = function(fCallback, oThis) {
            var ar = [];
            this.forEach(function(v, i, a) {
                if (fCallback.call(oThis, v, i, a) === true) {
                    ar[ar.length] = v;
                }
            });
            return jindo.$A(ar);
        }
    }
    return this.filter(fCallback, oThis);
}
;
jindo.$A.prototype.every = function(fCallback, oThis) {
    if (typeof this._array.every != "undefined") {
        jindo.$A.prototype.every = function(fCallback, oThis) {
            return this._array.every(fCallback, oThis);
        }
    } else {
        jindo.$A.prototype.every = function(fCallback, oThis) {
            var result = true;
            this.forEach(function(v, i, a) {
                if (fCallback.call(oThis, v, i, a) === false) {
                    result = false;
                    jindo.$A.Break();
                }
            });
            return result;
        }
    }
    return this.every(fCallback, oThis);
}
;
jindo.$A.prototype.some = function(fCallback, oThis) {
    if (typeof this._array.some != "undefined") {
        jindo.$A.prototype.some = function(fCallback, oThis) {
            return this._array.some(fCallback, oThis);
        }
    } else {
        jindo.$A.prototype.some = function(fCallback, oThis) {
            var result = false;
            this.forEach(function(v, i, a) {
                if (fCallback.call(oThis, v, i, a) === true) {
                    result = true;
                    jindo.$A.Break();
                }
            });
            return result;
        }
    }
    return this.some(fCallback, oThis);
}
;
jindo.$A.prototype.refuse = function(oValue1) {
    var a = jindo.$A(Array.prototype.slice.apply(arguments));
    return this.filter(function(v, i) {
        return !a.has(v)
    });
}
;
jindo.$A.prototype.unique = function() {
    var a = this._array
      , b = []
      , l = a.length;
    var i, j;
    for (i = 0; i < l; i++) {
        for (j = 0; j < b.length; j++) {
            if (a[i] == b[j])
                break;
        }
        if (j >= b.length)
            b[j] = a[i];
    }
    this._array = b;
    return this;
}
;
jindo.$Ajax = function(url, option) {
    var cl = arguments.callee;
    if (!(this instanceof cl))
        return new cl(url,option);
    function _getXHR() {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        } else if (ActiveXObject) {
            try {
                return new ActiveXObject('MSXML2.XMLHTTP');
            } catch (e) {
                return new ActiveXObject('Microsoft.XMLHTTP');
            }
            return null;
        }
    }
    var loc = location.toString();
    var domain = '';
    try {
        domain = loc.match(/^https?:\/\/([a-z0-9_\-\.]+)/i)[1];
    } catch (e) {}
    this._status = 0;
    this._url = url;
    this._options = new Object;
    this._headers = new Object;
    this._options = {
        type: "xhr",
        method: "post",
        proxy: "",
        timeout: 0,
        onload: function(req) {},
        onerror: null,
        ontimeout: function(req) {},
        jsonp_charset: "utf-8",
        callbackid: "",
        callbackname: "",
        sendheader: true,
        async: true,
        decode: true,
        postBody: false
    };
    this.option(option);
    if (jindo.$Ajax.CONFIG) {
        this.option(jindo.$Ajax.CONFIG);
    }
    var _opt = this._options;
    _opt.type = _opt.type.toLowerCase();
    _opt.method = _opt.method.toLowerCase();
    if (typeof window.__jindo2_callback == "undefined") {
        window.__jindo2_callback = new Array();
    }
    switch (_opt.type) {
    case "put":
    case "delete":
    case "get":
    case "post":
        _opt.method = _opt.type;
        _opt.type = "xhr";
    case "xhr":
        this._request = _getXHR();
        break;
    case "flash":
        if (!jindo.$Ajax.SWFRequest)
            throw Error('Require jindo.$Ajax.SWFRequest');
        this._request = new jindo.$Ajax.SWFRequest(jindo.$Fn(this.option, this).bind());
        break;
    case "jsonp":
        if (!jindo.$Ajax.JSONPRequest)
            throw Error('Require jindo.$Ajax.JSONPRequest');
        _opt.method = "get";
        this._request = new jindo.$Ajax.JSONPRequest(jindo.$Fn(this.option, this).bind());
        break;
    case "iframe":
        if (!jindo.$Ajax.FrameRequest)
            throw Error('Require jindo.$Ajax.FrameRequest');
        this._request = new jindo.$Ajax.FrameRequest(jindo.$Fn(this.option, this).bind());
        break;
    }
}
;
jindo.$Ajax.prototype._onload = (function(isIE) {
    if (isIE) {
        return function() {
            var bSuccess = this._request.readyState == 4 && this._request.status == 200;
            var oResult;
            if (this._request.readyState == 4) {
                try {
                    if (this._request.status != 200 && typeof this._options.onerror == 'function') {
                        if (!this._request.status == 0) {
                            this._options.onerror(jindo.$Ajax.Response(this._request));
                        }
                    } else {
                        if (!this._is_abort) {
                            oResult = this._options.onload(jindo.$Ajax.Response(this._request));
                        }
                    }
                } finally {
                    if (typeof this._oncompleted == 'function') {
                        this._oncompleted(bSuccess, oResult);
                    }
                    if (this._options.type == "xhr") {
                        this.abort();
                        try {
                            delete this._request.onload;
                        } catch (e) {
                            this._request.onload = undefined;
                        }
                    }
                    delete this._request.onreadystatechange;
                }
            }
        }
    } else {
        return function() {
            var bSuccess = this._request.readyState == 4 && this._request.status == 200;
            var oResult;
            if (this._request.readyState == 4) {
                try {
                    if (this._request.status != 200 && typeof this._options.onerror == 'function') {
                        this._options.onerror(jindo.$Ajax.Response(this._request));
                    } else {
                        oResult = this._options.onload(jindo.$Ajax.Response(this._request));
                    }
                } finally {
                    this._status--;
                    if (typeof this._oncompleted == 'function') {
                        this._oncompleted(bSuccess, oResult);
                    }
                }
            }
        }
    }
}
)(/MSIE/.test(window.navigator.userAgent));
jindo.$Ajax.prototype.request = function(oData) {
    this._status++;
    var t = this;
    var req = this._request;
    var opt = this._options;
    var data, v, a = [], data = "";
    var _timer = null;
    var url = this._url;
    this._is_abort = false;
    if (opt.postBody && opt.type.toUpperCase() == "XHR" && opt.method.toUpperCase() != "GET") {
        if (typeof oData == 'string') {
            data = oData;
        } else {
            data = jindo.$Json(oData).toString();
        }
    } else if (typeof oData == "undefined" || !oData) {
        data = null;
    } else {
        for (var k in oData) {
            if (oData.hasOwnProperty(k)) {
                v = oData[k];
                if (typeof v == "function")
                    v = v();
                if (v instanceof Array || v instanceof jindo.$A) {
                    jindo.$A(v).forEach(function(value, index, array) {
                        a[a.length] = k + "=" + encodeURIComponent(value);
                    });
                } else {
                    a[a.length] = k + "=" + encodeURIComponent(v);
                }
            }
        }
        data = a.join("&");
    }
    if (data && opt.type.toUpperCase() == "XHR" && opt.method.toUpperCase() == "GET") {
        if (url.indexOf('?') == -1) {
            url += "?";
        } else {
            url += "&";
        }
        url += data;
        data = null;
    }
    req.open(opt.method.toUpperCase(), url, opt.async);
    if (opt.type.toUpperCase() == "XHR" && opt.method.toUpperCase() == "GET" && /MSIE/.test(window.navigator.userAgent)) {
        req.setRequestHeader("If-Modified-Since", "Thu, 1 Jan 1970 00:00:00 GMT");
    }
    if (opt.sendheader) {
        if (!this._headers["Content-Type"]) {
            req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
        }
        req.setRequestHeader("charset", "utf-8");
        for (var x in this._headers) {
            if (this._headers.hasOwnProperty(x)) {
                if (typeof this._headers[x] == "function")
                    continue;
                req.setRequestHeader(x, String(this._headers[x]));
            }
        }
    }
    var navi = navigator.userAgent;
    if (req.addEventListener && !(navi.indexOf("Opera") > -1) && !(navi.indexOf("MSIE") > -1)) {
        if (this._loadFunc) {
            req.removeEventListener("load", this._loadFunc, false);
        }
        this._loadFunc = function(rq) {
            clearTimeout(_timer);
            _timer = undefined;
            t._onload(rq);
        }
        req.addEventListener("load", this._loadFunc, false);
    } else {
        if (typeof req.onload != "undefined") {
            req.onload = function(rq) {
                if (req.readyState == 4 && !t._is_abort) {
                    clearTimeout(_timer);
                    _timer = undefined;
                    t._onload(rq);
                }
            }
            ;
        } else {
            if (window.navigator.userAgent.match(/(?:MSIE) ([0-9.]+)/)[1] == 6 && opt.async) {
                var onreadystatechange = function(rq) {
                    if (req.readyState == 4 && !t._is_abort) {
                        if (_timer) {
                            clearTimeout(_timer);
                            _timer = undefined;
                        }
                        t._onload(rq);
                        clearInterval(t._interval);
                        t._interval = undefined;
                    }
                };
                this._interval = setInterval(onreadystatechange, 300);
            } else {
                req.onreadystatechange = function(rq) {
                    if (req.readyState == 4) {
                        clearTimeout(_timer);
                        _timer = undefined;
                        t._onload(rq);
                    }
                }
                ;
            }
        }
    }
    if (opt.timeout > 0) {
        if (this._timer)
            clearTimeout(this._timer);
        _timer = setTimeout(function() {
            t._is_abort = true;
            if (t._interval) {
                clearInterval(t._interval);
                t._interval = undefined;
            }
            try {
                req.abort();
            } catch (e) {}
            ;opt.ontimeout(req);
            if (typeof t._oncompleted == 'function')
                t._oncompleted(false);
        }, opt.timeout * 1000);
        this._timer = _timer;
    }
    this._test_url = url;
    req.send(data);
    return this;
}
;
jindo.$Ajax.prototype.isIdle = function() {
    return this._status == 0;
}
jindo.$Ajax.prototype.abort = function() {
    try {
        if (this._interval)
            clearInterval(this._interval);
        if (this._timer)
            clearTimeout(this._timer);
        this._interval = undefined;
        this._timer = undefined;
        this._is_abort = true;
        this._request.abort();
    } finally {
        this._status--;
    }
    return this;
}
;
jindo.$Ajax.prototype.option = function(name, value) {
    if (typeof name == "undefined")
        return "";
    if (typeof name == "string") {
        if (typeof value == "undefined")
            return this._options[name];
        this._options[name] = value;
        return this;
    }
    try {
        for (var x in name) {
            if (name.hasOwnProperty(x))
                this._options[x] = name[x]
        }
    } catch (e) {}
    ;return this;
}
;
jindo.$Ajax.prototype.header = function(name, value) {
    if (typeof name == "undefined")
        return "";
    if (typeof name == "string") {
        if (typeof value == "undefined")
            return this._headers[name];
        this._headers[name] = value;
        return this;
    }
    try {
        for (var x in name) {
            if (name.hasOwnProperty(x))
                this._headers[x] = name[x]
        }
    } catch (e) {}
    ;return this;
}
;
jindo.$Ajax.Response = function(req) {
    if (this === jindo.$Ajax)
        return new jindo.$Ajax.Response(req);
    this._response = req;
}
;
jindo.$Ajax.Response.prototype.xml = function() {
    return this._response.responseXML;
}
;
jindo.$Ajax.Response.prototype.text = function() {
    return this._response.responseText;
}
;
jindo.$Ajax.Response.prototype.status = function() {
    return this._response.status;
}
;
jindo.$Ajax.Response.prototype.readyState = function() {
    return this._response.readyState;
}
;
jindo.$Ajax.Response.prototype.json = function() {
    if (this._response.responseJSON) {
        return this._response.responseJSON;
    } else if (this._response.responseText) {
        try {
            return eval("(" + this._response.responseText + ")");
        } catch (e) {
            return {};
        }
    }
    return {};
}
;
jindo.$Ajax.Response.prototype.header = function(name) {
    if (typeof name == "string")
        return this._response.getResponseHeader(name);
    return this._response.getAllResponseHeaders();
}
;
jindo.$Ajax.RequestBase = jindo.$Class({
    _respHeaderString: "",
    callbackid: "",
    callbackname: "",
    responseXML: null,
    responseJSON: null,
    responseText: "",
    status: 404,
    readyState: 0,
    $init: function(fpOption) {},
    onload: function() {},
    abort: function() {},
    open: function() {},
    send: function() {},
    setRequestHeader: function(sName, sValue) {
        this._headers[sName] = sValue;
    },
    getResponseHeader: function(sName) {
        return this._respHeaders[sName] || "";
    },
    getAllResponseHeaders: function() {
        return this._respHeaderString;
    },
    _getCallbackInfo: function() {
        var id = "";
        if (this.option("callbackid") != "") {
            var idx = 0;
            do {
                id = "_" + this.option("callbackid") + "_" + idx;
                idx++;
            } while (window.__jindo2_callback[id]);
        } else {
            do {
                id = "_" + Math.floor(Math.random() * 10000);
            } while (window.__jindo2_callback[id]);
        }
        if (this.option("callbackname") == "") {
            this.option("callbackname", "_callback");
        }
        return {
            callbackname: this.option("callbackname"),
            id: id,
            name: "window.__jindo2_callback." + id
        };
    }
});
jindo.$Ajax.JSONPRequest = jindo.$Class({
    _headers: {},
    _respHeaders: {},
    _script: null,
    _onerror: null,
    $init: function(fpOption) {
        this.option = fpOption;
    },
    _callback: function(data) {
        if (this._onerror) {
            clearTimeout(this._onerror);
            this._onerror = null;
        }
        var self = this;
        this.responseJSON = data;
        this.onload(this);
        setTimeout(function() {
            self.abort()
        }, 10);
    },
    abort: function() {
        if (this._script) {
            try {
                this._script.parentNode.removeChild(this._script);
            } catch (e) {}
            ;
        }
    },
    open: function(method, url) {
        this.responseJSON = null;
        this._url = url;
    },
    send: function(data) {
        var t = this;
        var info = this._getCallbackInfo();
        var head = document.getElementsByTagName("head")[0];
        this._script = jindo.$("<script>");
        this._script.type = "text/javascript";
        this._script.charset = this.option("jsonp_charset");
        if (head) {
            head.appendChild(this._script);
        } else if (document.body) {
            document.body.appendChild(this._script);
        }
        window.__jindo2_callback[info.id] = function(data) {
            try {
                t.readyState = 4;
                t.status = 200;
                t._callback(data);
            } finally {
                delete window.__jindo2_callback[info.id];
            }
        }
        ;
        var agent = jindo.$Agent(navigator);
        if (agent.navigator().ie || agent.navigator().opera) {
            this._script.onreadystatechange = function() {
                if (this.readyState == 'loaded') {
                    if (!t.responseJSON) {
                        t.readyState = 4;
                        t.status = 500;
                        t._onerror = setTimeout(function() {
                            t._callback(null);
                        }, 200);
                    }
                    this.onreadystatechange = null;
                }
            }
            ;
        } else {
            this._script.onload = function() {
                if (!t.responseJSON) {
                    t.readyState = 4;
                    t.status = 500;
                    t._onerror = setTimeout(function() {
                        t._callback(null);
                    }, 200);
                }
                this.onload = null;
                this.onerror = null;
            }
            ;
            this._script.onerror = function() {
                if (!t.responseJSON) {
                    t.readyState = 4;
                    t.status = 404;
                    t._onerror = setTimeout(function() {
                        t._callback(null);
                    }, 200);
                }
                this.onerror = null;
                this.onload = null;
            }
            ;
        }
        var delimiter = "&";
        if (this._url.indexOf('?') == -1) {
            delimiter = "?";
        }
        if (data) {
            data = "&" + data;
        } else {
            data = "";
        }
        this._test_url = this._url + delimiter + info.callbackname + "=" + info.name + data;
        this._script.src = this._url + delimiter + info.callbackname + "=" + info.name + data;
    }
}).extend(jindo.$Ajax.RequestBase);
jindo.$Ajax.SWFRequest = jindo.$Class({
    $init: function(fpOption) {
        this.option = fpOption;
    },
    _headers: {},
    _respHeaders: {},
    _getFlashObj: function() {
        var navi = jindo.$Agent(window.navigator).navigator();
        var obj;
        if (navi.ie && navi.version == 9) {
            obj = document.getElementById(jindo.$Ajax.SWFRequest._tmpId);
        } else {
            obj = window.document[jindo.$Ajax.SWFRequest._tmpId];
        }
        return (this._getFlashObj = function() {
            return obj;
        }
        )();
    },
    _callback: function(status, data, headers) {
        this.readyState = 4;
        if ((typeof status).toLowerCase() == 'number') {
            this.status = status;
        } else {
            if (status == true)
                this.status = 200;
        }
        if (this.status == 200) {
            if (typeof data == "string") {
                try {
                    this.responseText = this.option("decode") ? decodeURIComponent(data) : data;
                    if (!this.responseText || this.responseText == "") {
                        this.responseText = data;
                    }
                } catch (e) {
                    if (e.name == "URIError") {
                        this.responseText = data;
                        if (!this.responseText || this.responseText == "") {
                            this.responseText = data;
                        }
                    }
                }
            }
            if (typeof headers == "object") {
                this._respHeaders = headers;
            }
        }
        this.onload(this);
    },
    open: function(method, url) {
        var re = /https?:\/\/([a-z0-9_\-\.]+)/i;
        this._url = url;
        this._method = method;
    },
    send: function(data) {
        this.responseXML = false;
        this.responseText = "";
        var t = this;
        var dat = {};
        var info = this._getCallbackInfo();
        var swf = this._getFlashObj()
        function f(arg) {
            switch (typeof arg) {
            case "string":
                return '"' + arg.replace(/\"/g, '\\"') + '"';
                break;
            case "number":
                return arg;
                break;
            case "object":
                var ret = ""
                  , arr = [];
                if (arg instanceof Array) {
                    for (var i = 0; i < arg.length; i++) {
                        arr[i] = f(arg[i]);
                    }
                    ret = "[" + arr.join(",") + "]";
                } else {
                    for (var x in arg) {
                        if (arg.hasOwnProperty(x)) {
                            arr[arr.length] = f(x) + ":" + f(arg[x]);
                        }
                    }
                    ret = "{" + arr.join(",") + "}";
                }
                return ret;
            default:
                return '""';
            }
        }
        data = (data || "").split("&");
        for (var i = 0; i < data.length; i++) {
            pos = data[i].indexOf("=");
            key = data[i].substring(0, pos);
            val = data[i].substring(pos + 1);
            dat[key] = decodeURIComponent(val);
        }
        this._current_callback_id = info.id
        window.__jindo2_callback[info.id] = function(success, data) {
            try {
                t._callback(success, data);
            } finally {
                delete window.__jindo2_callback[info.id];
            }
        }
        ;
        var oData = {
            url: this._url,
            type: this._method,
            data: dat,
            charset: "UTF-8",
            callback: info.name,
            header_json: this._headers
        };
        swf.requestViaFlash(f(oData));
    },
    abort: function() {
        if (this._current_callback_id) {
            window.__jindo2_callback[this._current_callback_id] = function() {
                delete window.__jindo2_callback[info.id];
            }
        }
    }
}).extend(jindo.$Ajax.RequestBase);
jindo.$Ajax.SWFRequest.write = function(swf_path) {
    if (typeof swf_path == "undefined")
        swf_path = "./ajax.swf";
    jindo.$Ajax.SWFRequest._tmpId = 'tmpSwf' + (new Date()).getMilliseconds() + Math.floor(Math.random() * 100000);
    var activeCallback = "jindo.$Ajax.SWFRequest.loaded";
    jindo.$Ajax._checkFlashLoad();
    document.write('<div style="position:absolute;top:-1000px;left:-1000px"><object id="' + jindo.$Ajax.SWFRequest._tmpId + '" width="1" height="1" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0"><param name="movie" value="' + swf_path + '"><param name = "FlashVars" value = "activeCallback=' + activeCallback + '" /><param name = "allowScriptAccess" value = "always" /><embed name="' + jindo.$Ajax.SWFRequest._tmpId + '" src="' + swf_path + '" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" width="1" height="1" allowScriptAccess="always" swLiveConnect="true" FlashVars="activeCallback=' + activeCallback + '"></embed></object></div>');
}
;
jindo.$Ajax._checkFlashLoad = function() {
    jindo.$Ajax._checkFlashKey = setTimeout(function() {}, 5000);
    jindo.$Ajax._checkFlashLoad = function() {}
}
jindo.$Ajax.SWFRequest.activeFlash = false;
jindo.$Ajax.SWFRequest.loaded = function() {
    clearTimeout(jindo.$Ajax._checkFlashKey);
    jindo.$Ajax.SWFRequest.activeFlash = true;
}
jindo.$Ajax.FrameRequest = jindo.$Class({
    _headers: {},
    _respHeaders: {},
    _frame: null,
    _domain: "",
    $init: function(fpOption) {
        this.option = fpOption;
    },
    _callback: function(id, data, header) {
        var self = this;
        this.readyState = 4;
        this.status = 200;
        this.responseText = data;
        this._respHeaderString = header;
        header.replace(/^([\w\-]+)\s*:\s*(.+)$/m, function($0, $1, $2) {
            self._respHeaders[$1] = $2;
        });
        this.onload(this);
        setTimeout(function() {
            self.abort()
        }, 10);
    },
    abort: function() {
        if (this._frame) {
            try {
                this._frame.parentNode.removeChild(this._frame);
            } catch (e) {}
        }
    },
    open: function(method, url) {
        var re = /https?:\/\/([a-z0-9_\-\.]+)/i;
        var dom = document.location.toString().match(re);
        this._method = method;
        this._url = url;
        this._remote = String(url).match(/(https?:\/\/[a-z0-9_\-\.]+)(:[0-9]+)?/i)[0];
        this._frame = null;
        this._domain = (dom[1] != document.domain) ? document.domain : "";
    },
    send: function(data) {
        this.responseXML = "";
        this.responseText = "";
        var t = this;
        var re = /https?:\/\/([a-z0-9_\-\.]+)/i;
        var info = this._getCallbackInfo();
        var url;
        var _aStr = [];
        _aStr.push(this._remote + "/ajax_remote_callback.html?method=" + this._method);
        var header = new Array;
        window.__jindo2_callback[info.id] = function(id, data, header) {
            try {
                t._callback(id, data, header);
            } finally {
                delete window.__jindo2_callback[info.id];
            }
        }
        ;
        for (var x in this._headers) {
            if (this._headers.hasOwnProperty(x)) {
                header[header.length] = "'" + x + "':'" + this._headers[x] + "'";
            }
        }
        header = "{" + header.join(",") + "}";
        _aStr.push("&id=" + info.id);
        _aStr.push("&header=" + encodeURIComponent(header));
        _aStr.push("&proxy=" + encodeURIComponent(this.option("proxy")));
        _aStr.push("&domain=" + this._domain);
        _aStr.push("&url=" + encodeURIComponent(this._url.replace(re, "")));
        _aStr.push("#" + encodeURIComponent(data));
        var fr = this._frame = jindo.$("<iframe>");
        fr.style.position = "absolute";
        fr.style.visibility = "hidden";
        fr.style.width = "1px";
        fr.style.height = "1px";
        var body = document.body || document.documentElement;
        if (body.firstChild) {
            body.insertBefore(fr, body.firstChild);
        } else {
            body.appendChild(fr);
        }
        fr.src = _aStr.join("");
    }
}).extend(jindo.$Ajax.RequestBase);
jindo.$Ajax.Queue = function(option) {
    var cl = arguments.callee;
    if (!(this instanceof cl)) {
        return new cl(option);
    }
    this._options = {
        async: false,
        useResultAsParam: false,
        stopOnFailure: false
    };
    this.option(option);
    this._queue = [];
}
jindo.$Ajax.Queue.prototype.option = function(name, value) {
    if (typeof name == "undefined") {
        return "";
    }
    if (typeof name == "string") {
        if (typeof value == "undefined") {
            return this._options[name];
        }
        this._options[name] = value;
        return this;
    }
    try {
        for (var x in name) {
            if (name.hasOwnProperty(x))
                this._options[x] = name[x]
        }
    } catch (e) {}
    ;return this;
}
;
jindo.$Ajax.Queue.prototype.add = function(oAjax, oParam) {
    this._queue.push({
        obj: oAjax,
        param: oParam
    });
}
jindo.$Ajax.Queue.prototype.request = function() {
    if (this.option('async')) {
        this._requestAsync();
    } else {
        this._requestSync(0);
    }
}
jindo.$Ajax.Queue.prototype._requestSync = function(nIdx, oParam) {
    var t = this;
    if (this._queue.length > nIdx + 1) {
        this._queue[nIdx].obj._oncompleted = function(bSuccess, oResult) {
            if (!t.option('stopOnFailure') || bSuccess)
                t._requestSync(nIdx + 1, oResult);
        }
        ;
    }
    var _oParam = this._queue[nIdx].param || {};
    if (this.option('useResultAsParam') && oParam) {
        try {
            for (var x in oParam)
                if (typeof _oParam[x] == 'undefined' && oParam.hasOwnProperty(x))
                    _oParam[x] = oParam[x]
        } catch (e) {}
        ;
    }
    this._queue[nIdx].obj.request(_oParam);
}
jindo.$Ajax.Queue.prototype._requestAsync = function() {
    for (var i = 0; i < this._queue.length; i++)
        this._queue[i].obj.request(this._queue[i].param);
}
jindo.$H = function(hashObject) {
    var cl = arguments.callee;
    if (typeof hashObject == "undefined")
        hashObject = new Object;
    if (hashObject instanceof cl)
        return hashObject;
    if (!(this instanceof cl))
        return new cl(hashObject);
    this._table = {};
    for (var k in hashObject) {
        if (hashObject.hasOwnProperty(k)) {
            this._table[k] = hashObject[k];
        }
    }
}
;
jindo.$H.prototype.$value = function() {
    return this._table;
}
;
jindo.$H.prototype.$ = function(key, value) {
    if (typeof value == "undefined") {
        return this._table[key];
    }
    this._table[key] = value;
    return this;
}
;
jindo.$H.prototype.length = function() {
    var i = 0;
    for (var k in this._table) {
        if (this._table.hasOwnProperty(k)) {
            if (typeof Object.prototype[k] != "undeifned" && Object.prototype[k] === this._table[k])
                continue;
            i++;
        }
    }
    return i;
}
;
jindo.$H.prototype.forEach = function(callback, thisObject) {
    var t = this._table;
    var h = this.constructor;
    for (var k in t) {
        if (t.hasOwnProperty(k)) {
            if (!t.propertyIsEnumerable(k))
                continue;
            try {
                callback.call(thisObject, t[k], k, t);
            } catch (e) {
                if (e instanceof h.Break)
                    break;
                if (e instanceof h.Continue)
                    continue;
                throw e;
            }
        }
    }
    return this;
}
;
jindo.$H.prototype.filter = function(callback, thisObject) {
    var h = jindo.$H();
    this.forEach(function(v, k, o) {
        if (callback.call(thisObject, v, k, o) === true) {
            h.add(k, v);
        }
    });
    return h;
}
;
jindo.$H.prototype.map = function(callback, thisObject) {
    var t = this._table;
    this.forEach(function(v, k, o) {
        t[k] = callback.call(thisObject, v, k, o);
    });
    return this;
}
;
jindo.$H.prototype.add = function(key, value) {
    this._table[key] = value;
    return this;
}
;
jindo.$H.prototype.remove = function(key) {
    if (typeof this._table[key] == "undefined")
        return null;
    var val = this._table[key];
    delete this._table[key];
    return val;
}
;
jindo.$H.prototype.search = function(value) {
    var result = false;
    this.forEach(function(v, k, o) {
        if (v === value) {
            result = k;
            jindo.$H.Break();
        }
    });
    return result;
}
;
jindo.$H.prototype.hasKey = function(key) {
    var result = false;
    return (typeof this._table[key] != "undefined");
}
;
jindo.$H.prototype.hasValue = function(value) {
    return (this.search(value) !== false);
}
;
jindo.$H.prototype.sort = function() {
    var o = new Object;
    var a = this.values();
    var k = false;
    a.sort();
    for (var i = 0; i < a.length; i++) {
        k = this.search(a[i]);
        o[k] = a[i];
        delete this._table[k];
    }
    this._table = o;
    return this;
}
;
jindo.$H.prototype.ksort = function() {
    var o = new Object;
    var a = this.keys();
    a.sort();
    for (var i = 0; i < a.length; i++) {
        o[a[i]] = this._table[a[i]];
    }
    this._table = o;
    return this;
}
;
jindo.$H.prototype.keys = function() {
    var keys = new Array;
    for (var k in this._table) {
        if (this._table.hasOwnProperty(k))
            keys.push(k);
    }
    return keys;
}
;
jindo.$H.prototype.values = function() {
    var values = [];
    for (var k in this._table) {
        if (this._table.hasOwnProperty(k))
            values[values.length] = this._table[k];
    }
    return values;
}
;
jindo.$H.prototype.toQueryString = function() {
    var buf = []
      , val = null
      , idx = 0;
    for (var k in this._table) {
        if (this._table.hasOwnProperty(k)) {
            if (typeof (val = this._table[k]) == "object" && val.constructor == Array) {
                for (i = 0; i < val.length; i++) {
                    buf[buf.length] = encodeURIComponent(k) + "[]=" + encodeURIComponent(val[i] + "");
                }
            } else {
                buf[buf.length] = encodeURIComponent(k) + "=" + encodeURIComponent(this._table[k] + "");
            }
        }
    }
    return buf.join("&");
}
;
jindo.$H.prototype.empty = function() {
    var keys = this.keys();
    for (var i = 0; i < keys.length; i++) {
        delete this._table[keys[i]];
    }
    return this;
}
;
jindo.$H.Break = function() {
    if (!(this instanceof arguments.callee))
        throw new arguments.callee;
}
;
jindo.$H.Continue = function() {
    if (!(this instanceof arguments.callee))
        throw new arguments.callee;
}
;
jindo.$Json = function(sObject) {
    var cl = arguments.callee;
    if (typeof sObject == "undefined")
        sObject = {};
    if (sObject instanceof cl)
        return sObject;
    if (!(this instanceof cl))
        return new cl(sObject);
    if (typeof sObject == "string") {
        this._object = jindo.$Json._oldMakeJSON(sObject);
    } else {
        this._object = sObject;
    }
}
jindo.$Json._oldMakeJSON = function(sObject) {
    try {
        if (/^(?:\s*)[\{\[]/.test(sObject)) {
            sObject = eval("(" + sObject + ")");
        } else {
            sObject = sObject;
        }
    } catch (e) {
        sObject = {};
    }
    return sObject;
}
jindo.$Json.fromXML = function(sXML) {
    var o = {};
    var re = /\s*<(\/?[\w:\-]+)((?:\s+[\w:\-]+\s*=\s*(?:"(?:\\"|[^"])*"|'(?:\\'|[^'])*'))*)\s*((?:\/>)|(?:><\/\1>|\s*))|\s*<!\[CDATA\[([\w\W]*?)\]\]>\s*|\s*>?([^<]*)/ig;
    var re2 = /^[0-9]+(?:\.[0-9]+)?$/;
    var ec = {
        "&amp;": "&",
        "&nbsp;": " ",
        "&quot;": "\"",
        "&lt;": "<",
        "&gt;": ">"
    };
    var fg = {
        tags: ["/"],
        stack: [o]
    };
    var es = function(s) {
        if (typeof s == "undefined")
            return "";
        return s.replace(/&[a-z]+;/g, function(m) {
            return (typeof ec[m] == "string") ? ec[m] : m;
        })
    };
    var at = function(s, c) {
        s.replace(/([\w\:\-]+)\s*=\s*(?:"((?:\\"|[^"])*)"|'((?:\\'|[^'])*)')/g, function($0, $1, $2, $3) {
            c[$1] = es(($2 ? $2.replace(/\\"/g, '"') : undefined) || ($3 ? $3.replace(/\\'/g, "'") : undefined));
        })
    };
    var em = function(o) {
        for (var x in o) {
            if (o.hasOwnProperty(x)) {
                if (Object.prototype[x])
                    continue;
                return false;
            }
        }
        ;return true
    };
    var cb = function($0, $1, $2, $3, $4, $5) {
        var cur, cdata = "";
        var idx = fg.stack.length - 1;
        if (typeof $1 == "string" && $1) {
            if ($1.substr(0, 1) != "/") {
                var has_attr = (typeof $2 == "string" && $2);
                var closed = (typeof $3 == "string" && $3);
                var newobj = (!has_attr && closed) ? "" : {};
                cur = fg.stack[idx];
                if (typeof cur[$1] == "undefined") {
                    cur[$1] = newobj;
                    cur = fg.stack[idx + 1] = cur[$1];
                } else if (cur[$1]instanceof Array) {
                    var len = cur[$1].length;
                    cur[$1][len] = newobj;
                    cur = fg.stack[idx + 1] = cur[$1][len];
                } else {
                    cur[$1] = [cur[$1], newobj];
                    cur = fg.stack[idx + 1] = cur[$1][1];
                }
                if (has_attr)
                    at($2, cur);
                fg.tags[idx + 1] = $1;
                if (closed) {
                    fg.tags.length--;
                    fg.stack.length--;
                }
            } else {
                fg.tags.length--;
                fg.stack.length--;
            }
        } else if (typeof $4 == "string" && $4) {
            cdata = $4;
        } else if (typeof $5 == "string" && $5) {
            cdata = es($5);
        }
        if (cdata.replace(/^\s+/g, "").length > 0) {
            var par = fg.stack[idx - 1];
            var tag = fg.tags[idx];
            if (re2.test(cdata)) {
                cdata = parseFloat(cdata);
            } else if (cdata == "true") {
                cdata = true;
            } else if (cdata == "false") {
                cdata = false;
            }
            if (typeof par == 'undefined')
                return;
            if (par[tag]instanceof Array) {
                var o = par[tag];
                if (typeof o[o.length - 1] == "object" && !em(o[o.length - 1])) {
                    o[o.length - 1].$cdata = cdata;
                    o[o.length - 1].toString = function() {
                        return cdata;
                    }
                } else {
                    o[o.length - 1] = cdata;
                }
            } else {
                if (typeof par[tag] == "object" && !em(par[tag])) {
                    par[tag].$cdata = cdata;
                    par[tag].toString = function() {
                        return cdata;
                    }
                } else {
                    par[tag] = cdata;
                }
            }
        }
    };
    sXML = sXML.replace(/<(\?|\!-)[^>]*>/g, "");
    sXML.replace(re, cb);
    return jindo.$Json(o);
}
;
jindo.$Json.prototype.get = function(sPath) {
    var o = this._object;
    var p = sPath.split("/");
    var re = /^([\w:\-]+)\[([0-9]+)\]$/;
    var stack = [[o]]
      , cur = stack[0];
    var len = p.length, c_len, idx, buf, j, e;
    for (var i = 0; i < len; i++) {
        if (p[i] == "." || p[i] == "")
            continue;
        if (p[i] == "..") {
            stack.length--;
        } else {
            buf = [];
            idx = -1;
            c_len = cur.length;
            if (c_len == 0)
                return [];
            if (re.test(p[i]))
                idx = +RegExp.$2;
            for (j = 0; j < c_len; j++) {
                e = cur[j][p[i]];
                if (typeof e == "undefined")
                    continue;
                if (e instanceof Array) {
                    if (idx > -1) {
                        if (idx < e.length)
                            buf[buf.length] = e[idx];
                    } else {
                        buf = buf.concat(e);
                    }
                } else if (idx == -1) {
                    buf[buf.length] = e;
                }
            }
            stack[stack.length] = buf;
        }
        cur = stack[stack.length - 1];
    }
    return cur;
}
;
jindo.$Json.prototype.toString = function() {
    if (window.JSON && window.JSON.stringify) {
        jindo.$Json.prototype.toString = function() {
            try {
                return window.JSON.stringify(this._object);
            } catch (e) {
                return jindo.$Json._oldToString(this._object);
            }
        }
    } else {
        jindo.$Json.prototype.toString = function() {
            return jindo.$Json._oldToString(this._object);
        }
    }
    return this.toString();
}
;
jindo.$Json._oldToString = function(oObj) {
    var func = {
        $: function($) {
            if (typeof $ == "object" && $ == null)
                return 'null';
            if (typeof $ == "undefined")
                return '""';
            if (typeof $ == "boolean")
                return $ ? "true" : "false";
            if (typeof $ == "string")
                return this.s($);
            if (typeof $ == "number")
                return $;
            if ($instanceof Array)
                return this.a($);
            if ($instanceof Object)
                return this.o($);
        },
        s: function(s) {
            var e = {
                '"': '\\"',
                "\\": "\\\\",
                "\n": "\\n",
                "\r": "\\r",
                "\t": "\\t"
            };
            var c = function(m) {
                return (typeof e[m] != "undefined") ? e[m] : m
            };
            return '"' + s.replace(/[\\"'\n\r\t]/g, c) + '"';
        },
        a: function(a) {
            var s = "["
              , c = ""
              , n = a.length;
            for (var i = 0; i < n; i++) {
                if (typeof a[i] == "function")
                    continue;
                s += c + this.$(a[i]);
                if (!c)
                    c = ",";
            }
            return s + "]";
        },
        o: function(o) {
            o = jindo.$H(o).ksort().$value();
            var s = "{"
              , c = "";
            for (var x in o) {
                if (o.hasOwnProperty(x)) {
                    if (typeof o[x] == "function")
                        continue;
                    s += c + this.s(x) + ":" + this.$(o[x]);
                    if (!c)
                        c = ",";
                }
            }
            return s + "}";
        }
    }
    return func.$(oObj);
}
jindo.$Json.prototype.toXML = function() {
    var f = function($, tag) {
        var t = function(s, at) {
            return "<" + tag + (at || "") + ">" + s + "</" + tag + ">"
        };
        switch (typeof $) {
        case "undefined":
        case "null":
            return t("");
        case "number":
            return t($);
        case "string":
            if ($.indexOf("<") < 0) {
                return t($.replace(/&/g, "&amp;"));
            } else {
                return t("<![CDATA[" + $ + "]]>");
            }
        case "boolean":
            return t(String($));
        case "object":
            var ret = "";
            if ($instanceof Array) {
                var len = $.length;
                for (var i = 0; i < len; i++) {
                    ret += f($[i], tag);
                }
                ;
            } else {
                var at = "";
                for (var x in $) {
                    if ($.hasOwnProperty(x)) {
                        if (x == "$cdata" || typeof $[x] == "function")
                            continue;
                        ret += f($[x], x);
                    }
                }
                if (tag)
                    ret = t(ret, at);
            }
            return ret;
        }
    };
    return f(this._object, "");
}
;
jindo.$Json.prototype.toObject = function() {
    return this._object;
}
;
jindo.$Json.prototype.compare = function(oData) {
    return jindo.$Json._oldToString(this._object).toString() == jindo.$Json._oldToString(jindo.$Json(oData).$value()).toString();
}
jindo.$Json.prototype.$value = jindo.$Json.prototype.toObject;
jindo.$Cookie = function() {
    var cl = arguments.callee;
    var cached = cl._cached;
    if (cl._cached)
        return cl._cached;
    if (!(this instanceof cl))
        return new cl;
    if (typeof cl._cached == "undefined")
        cl._cached = this;
}
;
jindo.$Cookie.prototype.keys = function() {
    var ca = document.cookie.split(";");
    var re = /^\s+|\s+$/g;
    var a = new Array;
    for (var i = 0; i < ca.length; i++) {
        a[a.length] = ca[i].substr(0, ca[i].indexOf("=")).replace(re, "");
    }
    return a;
}
;
jindo.$Cookie.prototype.get = function(sName) {
    var ca = document.cookie.split(/\s*;\s*/);
    var re = new RegExp("^(\\s*" + sName + "\\s*=)");
    for (var i = 0; i < ca.length; i++) {
        if (re.test(ca[i]))
            return unescape(ca[i].substr(RegExp.$1.length));
    }
    return null;
}
;
jindo.$Cookie.prototype.set = function(sName, sValue, nDays, sDomain, sPath) {
    var sExpire = "";
    if (typeof nDays == "number") {
        sExpire = ";expires=" + (new Date((new Date()).getTime() + nDays * 1000 * 60 * 60 * 24)).toGMTString();
    }
    if (typeof sDomain == "undefined")
        sDomain = "";
    if (typeof sPath == "undefined")
        sPath = "/";
    document.cookie = sName + "=" + escape(sValue) + sExpire + "; path=" + sPath + (sDomain ? "; domain=" + sDomain : "");
    return this;
}
;
jindo.$Cookie.prototype.remove = function(sName, sDomain, sPath) {
    if (this.get(sName) != null)
        this.set(sName, "", -1, sDomain, sPath);
    return this;
}
;
jindo.$Element = function(el) {
    var cl = arguments.callee;
    if (el && el instanceof cl)
        return el;
    if (el === null || typeof el == "undefined") {
        return null;
    } else {
        el = jindo.$(el);
        if (el === null) {
            return null;
        }
        ;
    }
    if (!(this instanceof cl))
        return new cl(el);
    this._element = (typeof el == "string") ? jindo.$(el) : el;
    var tag = this._element.tagName;
    this.tag = (typeof tag != 'undefined') ? tag.toLowerCase() : '';
}
var _j_ag = navigator.userAgent;
var IS_IE = _j_ag.indexOf("MSIE") > -1;
var IS_FF = _j_ag.indexOf("Firefox") > -1;
var IS_OP = _j_ag.indexOf("Opera") > -1;
var IS_SF = _j_ag.indexOf("Apple") > -1;
var IS_CH = _j_ag.indexOf("Chrome") > -1;
jindo.$Element.prototype.$value = function() {
    return this._element;
}
;
jindo.$Element.prototype.visible = function(bVisible, sDisplay) {
    if (typeof bVisible != "undefined") {
        this[bVisible ? "show" : "hide"](sDisplay);
        return this;
    }
    return (this.css("display") != "none");
}
;
jindo.$Element.prototype.show = function(sDisplay) {
    var s = this._element.style;
    var b = "block";
    var c = {
        p: b,
        div: b,
        form: b,
        h1: b,
        h2: b,
        h3: b,
        h4: b,
        ol: b,
        ul: b,
        fieldset: b,
        td: "table-cell",
        th: "table-cell",
        li: "list-item",
        table: "table",
        thead: "table-header-group",
        tbody: "table-row-group",
        tfoot: "table-footer-group",
        tr: "table-row",
        col: "table-column",
        colgroup: "table-column-group",
        caption: "table-caption",
        dl: b,
        dt: b,
        dd: b
    };
    try {
        if (sDisplay) {
            s.display = sDisplay;
        } else {
            var type = c[this.tag];
            s.display = type || "inline";
        }
    } catch (e) {
        s.display = "block";
    }
    return this;
}
;
jindo.$Element.prototype.hide = function() {
    this._element.style.display = "none";
    return this;
}
;
jindo.$Element.prototype.toggle = function(sDisplay) {
    this[this.visible() ? "hide" : "show"](sDisplay);
    return this;
}
;
jindo.$Element.prototype.opacity = function(value) {
    var v, e = this._element, b = (this._getCss(e, "display") != "none");
    value = parseFloat(value);
    e.style.zoom = 1;
    if (!isNaN(value)) {
        value = Math.max(Math.min(value, 1), 0);
        if (typeof e.filters != "undefined") {
            value = Math.ceil(value * 100);
            if (typeof e.filters != 'unknown' && typeof e.filters.alpha != "undefined") {
                e.filters.alpha.opacity = value;
            } else {
                e.style.filter = (e.style.filter + " alpha(opacity=" + value + ")");
            }
        } else {
            e.style.opacity = value;
        }
        return value;
    }
    if (typeof e.filters != "undefined") {
        v = (typeof e.filters.alpha == "undefined") ? (b ? 100 : 0) : e.filters.alpha.opacity;
        v = v / 100;
    } else {
        v = parseFloat(e.style.opacity);
        if (isNaN(v))
            v = b ? 1 : 0;
    }
    return v;
}
;
jindo.$Element.prototype.css = function(sName, sValue) {
    var e = this._element;
    var type_v = (typeof sValue);
    if (sName == 'opacity')
        return type_v == 'undefined' ? this.opacity() : this.opacity(sValue);
    var type_n = (typeof sName);
    if (type_n == "string") {
        var view;
        if (type_v == "string" || type_v == "number") {
            var obj = {};
            obj[sName] = sValue;
            sName = obj;
        } else {
            var _getCss = this._getCss;
            if ((IS_FF || IS_OP) && (sName == "backgroundPositionX" || sName == "backgroundPositionY")) {
                var bp = _getCss(e, "backgroundPosition").split(/\s+/);
                return (sName == "backgroundPositionX") ? bp[0] : bp[1];
            }
            if (IS_IE && sName == "backgroundPosition") {
                return _getCss(e, "backgroundPositionX") + " " + _getCss(e, "backgroundPositionY")
            }
            if ((IS_FF || IS_SF || IS_CH) && (sName == "padding" || sName == "margin")) {
                var top = _getCss(e, sName + "Top");
                var right = _getCss(e, sName + "Right");
                var bottom = _getCss(e, sName + "Bottom");
                var left = _getCss(e, sName + "Left");
                if ((top == right) && (bottom == left)) {
                    return top;
                } else if (top == bottom) {
                    if (right == left) {
                        return top + " " + right;
                    } else {
                        return top + " " + right + " " + bottom + " " + left;
                    }
                } else {
                    return top + " " + right + " " + bottom + " " + left;
                }
            }
            return _getCss(e, sName);
        }
    }
    var h = jindo.$H;
    if (typeof h != "undefined" && sName instanceof h) {
        sName = sName._table;
    }
    if (typeof sName == "object") {
        var v, type;
        for (var k in sName) {
            if (sName.hasOwnProperty(k)) {
                v = sName[k];
                type = (typeof v);
                if (type != "string" && type != "number")
                    continue;
                if (k == 'opacity') {
                    type == 'undefined' ? this.opacity() : this.opacity(v);
                    continue;
                }
                if (k == "cssFloat" && IS_IE)
                    k = "styleFloat";
                if ((IS_FF || IS_OP) && (k == "backgroundPositionX" || k == "backgroundPositionY")) {
                    var bp = this.css("backgroundPosition").split(/\s+/);
                    v = k == "backgroundPositionX" ? v + " " + bp[1] : bp[0] + " " + v;
                    this._setCss(e, "backgroundPosition", v);
                } else {
                    this._setCss(e, k, v);
                }
            }
        }
    }
    return this;
}
;
jindo.$Element.prototype._getCss = function(e, sName) {
    var fpGetCss;
    if (e.currentStyle) {
        fpGetCss = function(e, sName) {
            try {
                if (sName == "cssFloat")
                    sName = "styleFloat";
                var sStyle = e.style[sName];
                if (sStyle) {
                    return sStyle;
                } else {
                    var oCurrentStyle = e.currentStyle;
                    if (oCurrentStyle) {
                        return oCurrentStyle[sName];
                    }
                }
                return sStyle;
            } catch (ex) {
                throw new Error((e.tagName || "document") + "는 css를 사용 할수 없습니다.");
            }
        }
    } else if (window.getComputedStyle) {
        fpGetCss = function(e, sName) {
            try {
                if (sName == "cssFloat")
                    sName = "float";
                var d = e.ownerDocument || e.document || document;
                var sVal = (e.style[sName] || d.defaultView.getComputedStyle(e, null).getPropertyValue(sName.replace(/([A-Z])/g, "-$1").toLowerCase()));
                if (sName == "textDecoration")
                    sVal = sVal.replace(",", "");
                return sVal;
            } catch (ex) {
                throw new Error((e.tagName || "document") + "는 css를 사용 할수 없습니다.");
            }
        }
    } else {
        fpGetCss = function(e, sName) {
            try {
                if (sName == "cssFloat" && IS_IE)
                    sName = "styleFloat";
                return e.style[sName];
            } catch (ex) {
                throw new Error((e.tagName || "document") + "는 css를 사용 할수 없습니다.");
            }
        }
    }
    jindo.$Element.prototype._getCss = fpGetCss;
    return fpGetCss(e, sName);
}
jindo.$Element.prototype._setCss = function(e, k, v) {
    if (("#top#left#right#bottom#").indexOf(k + "#") > 0 && (typeof v == "number" || (/\d$/.test(v)))) {
        e.style[k] = parseInt(v, 10) + "px";
    } else {
        e.style[k] = v;
    }
}
jindo.$Element.prototype.attr = function(sName, sValue) {
    var e = this._element;
    if (typeof sName == "string") {
        if (typeof sValue != "undefined") {
            var obj = {};
            obj[sName] = sValue;
            sName = obj;
        } else {
            if (sName == "class" || sName == "className") {
                return e.className;
            } else if (sName == "style") {
                return e.style.cssText;
            } else if (sName == "checked" || sName == "disabled") {
                return !!e[sName];
            } else if (sName == "value") {
                return e.value;
            } else if (sName == "href") {
                return e.getAttribute(sName, 2);
            }
            return e.getAttribute(sName);
        }
    }
    if (typeof jindo.$H != "undefined" && sName instanceof jindo.$H) {
        sName = sName.$value();
    }
    if (typeof sName == "object") {
        for (var k in sName) {
            if (sName.hasOwnProperty(k)) {
                if (typeof (sValue) != "undefined" && sValue === null) {
                    e.removeAttribute(k);
                } else {
                    if (k == "class" || k == "className") {
                        e.className = sName[k];
                    } else if (k == "style") {
                        e.style.cssText = sName[k];
                    } else if (k == "checked" || k == "disabled") {
                        e[k] = sName[k];
                    } else if (k == "value") {
                        e.value = sName[k];
                    } else {
                        e.setAttribute(k, sName[k]);
                    }
                }
            }
        }
    }
    return this;
}
;
jindo.$Element.prototype.width = function(width) {
    if (typeof width == "number") {
        var e = this._element;
        e.style.width = width + "px";
        var off = e.offsetWidth;
        if (off != width && off !== 0) {
            var w = (width * 2 - off);
            if (w > 0)
                e.style.width = w + "px";
        }
        return this;
    }
    return this._element.offsetWidth;
}
;
jindo.$Element.prototype.height = function(height) {
    if (typeof height == "number") {
        var e = this._element;
        e.style.height = height + "px";
        var off = e.offsetHeight;
        if (off != height && off !== 0) {
            var height = (height * 2 - off);
            if (height > 0)
                e.style.height = height + "px";
        }
        return this;
    }
    return this._element.offsetHeight;
}
;
jindo.$Element.prototype.className = function(sClass) {
    var e = this._element;
    if (typeof sClass == "undefined")
        return e.className;
    e.className = sClass;
    return this;
}
;
jindo.$Element.prototype.hasClass = function(sClass) {
    if (this._element.classList) {
        jindo.$Element.prototype.hasClass = function(sClass) {
            return this._element.classList.contains(sClass);
        }
    } else {
        jindo.$Element.prototype.hasClass = function(sClass) {
            return (" " + this._element.className + " ").indexOf(" " + sClass + " ") > -1;
        }
    }
    return this.hasClass(sClass);
}
;
jindo.$Element.prototype.addClass = function(sClass) {
    if (this._element.classList) {
        jindo.$Element.prototype.addClass = function(sClass) {
            var aClass = sClass.split(/\s+/);
            var flistApi = this._element.classList;
            for (var i = aClass.length; i--; ) {
                flistApi.add(aClass[i]);
            }
            return this;
        }
    } else {
        jindo.$Element.prototype.addClass = function(sClass) {
            var e = this._element;
            var aClass = sClass.split(/\s+/);
            var eachClass;
            for (var i = aClass.length - 1; i >= 0; i--) {
                eachClass = aClass[i];
                if (!this.hasClass(eachClass)) {
                    e.className = (e.className + " " + eachClass).replace(/^\s+/, "");
                }
                ;
            }
            ;return this;
        }
    }
    return this.addClass(sClass);
}
;
jindo.$Element.prototype.removeClass = function(sClass) {
    if (this._element.classList) {
        jindo.$Element.prototype.removeClass = function(sClass) {
            var flistApi = this._element.classList;
            var aClass = sClass.split(" ");
            for (var i = aClass.length; i--; ) {
                flistApi.remove(aClass[i]);
            }
            return this;
        }
    } else {
        jindo.$Element.prototype.removeClass = function(sClass) {
            var e = this._element;
            var aClass = sClass.split(/\s+/);
            var eachClass;
            for (var i = aClass.length - 1; i >= 0; i--) {
                eachClass = aClass[i];
                if (this.hasClass(eachClass)) {
                    e.className = (" " + e.className.replace(/\s+$/, "").replace(/^\s+/, "") + " ").replace(" " + eachClass + " ", " ").replace(/\s+$/, "").replace(/^\s+/, "");
                }
                ;
            }
            ;return this;
        }
    }
    return this.removeClass(sClass);
}
;
jindo.$Element.prototype.toggleClass = function(sClass, sClass2) {
    if (this._element.classList) {
        jindo.$Element.prototype.toggleClass = function(sClass, sClass2) {
            if (typeof sClass2 == "undefined") {
                this._element.classList.toggle(sClass);
            } else {
                if (this.hasClass(sClass)) {
                    this.removeClass(sClass);
                    this.addClass(sClass2);
                } else {
                    this.addClass(sClass);
                    this.removeClass(sClass2);
                }
            }
            return this;
        }
    } else {
        jindo.$Element.prototype.toggleClass = function(sClass, sClass2) {
            sClass2 = sClass2 || "";
            if (this.hasClass(sClass)) {
                this.removeClass(sClass);
                if (sClass2)
                    this.addClass(sClass2);
            } else {
                this.addClass(sClass);
                if (sClass2)
                    this.removeClass(sClass2);
            }
            return this;
        }
    }
    return this.toggleClass(sClass, sClass2);
}
;
jindo.$Element.prototype.text = function(sText) {
    var ele = this._element;
    var tag = this.tag;
    var prop = (typeof ele.innerText != "undefined") ? "innerText" : "textContent";
    if (tag == "textarea" || tag == "input")
        prop = "value";
    var type = (typeof sText);
    if (type != "undefined" && (type == "string" || type == "number" || type == "boolean")) {
        sText += "";
        try {
            if (prop != "value")
                prop = (typeof ele.textContent != "undefined") ? "textContent" : "innerText";
            ele[prop] = sText;
        } catch (e) {
            return this.html(sText.replace(/&/g, '&amp;').replace(/</g, '&lt;'));
        }
        return this;
    }
    return ele[prop];
}
;
jindo.$Element.prototype.html = function(sHTML) {
    var isIe = IS_IE;
    var isFF = IS_FF;
    if (isIe) {
        jindo.$Element.prototype.html = function(sHTML) {
            if (typeof sHTML != "undefined" && arguments.length) {
                sHTML += "";
                jindo.$$.release();
                var oEl = this._element;
                while (oEl.firstChild) {
                    oEl.removeChild(oEl.firstChild);
                }
                var sId = 'R' + new Date().getTime() + parseInt(Math.random() * 100000, 10);
                var oDoc = oEl.ownerDocument || oEl.document || document;
                var oDummy;
                var sTag = oEl.tagName.toLowerCase();
                switch (sTag) {
                case 'select':
                case 'table':
                    oDummy = oDoc.createElement("div");
                    oDummy.innerHTML = '<' + sTag + ' class="' + sId + '">' + sHTML + '</' + sTag + '>';
                    break;
                case 'tr':
                case 'thead':
                case 'tbody':
                case 'colgroup':
                    oDummy = oDoc.createElement("div");
                    oDummy.innerHTML = '<table><' + sTag + ' class="' + sId + '">' + sHTML + '</' + sTag + '></table>';
                    break;
                default:
                    oEl.innerHTML = sHTML;
                    break;
                }
                if (oDummy) {
                    var oFound;
                    for (oFound = oDummy.firstChild; oFound; oFound = oFound.firstChild)
                        if (oFound.className == sId)
                            break;
                    if (oFound) {
                        var notYetSelected = true;
                        for (var oChild; oChild = oEl.firstChild; )
                            oChild.removeNode(true);
                        for (var oChild = oFound.firstChild; oChild; oChild = oFound.firstChild) {
                            if (sTag == 'select') {
                                var cloneNode = oChild.cloneNode(true);
                                if (oChild.selected && notYetSelected) {
                                    notYetSelected = false;
                                    cloneNode.selected = true;
                                }
                                oEl.appendChild(cloneNode);
                                oChild.removeNode(true);
                            } else {
                                oEl.appendChild(oChild);
                            }
                        }
                        oDummy.removeNode && oDummy.removeNode(true);
                    }
                    oDummy = null;
                }
                return this;
            }
            return this._element.innerHTML;
        }
    } else if (isFF) {
        jindo.$Element.prototype.html = function(sHTML) {
            if (typeof sHTML != "undefined" && arguments.length) {
                sHTML += "";
                var oEl = this._element;
                if (!oEl.parentNode) {
                    var sId = 'R' + new Date().getTime() + parseInt(Math.random() * 100000, 10);
                    var oDoc = oEl.ownerDocument || oEl.document || document;
                    var oDummy;
                    var sTag = oEl.tagName.toLowerCase();
                    switch (sTag) {
                    case 'select':
                    case 'table':
                        oDummy = oDoc.createElement("div");
                        oDummy.innerHTML = '<' + sTag + ' class="' + sId + '">' + sHTML + '</' + sTag + '>';
                        break;
                    case 'tr':
                    case 'thead':
                    case 'tbody':
                    case 'colgroup':
                        oDummy = oDoc.createElement("div");
                        oDummy.innerHTML = '<table><' + sTag + ' class="' + sId + '">' + sHTML + '</' + sTag + '></table>';
                        break;
                    default:
                        oEl.innerHTML = sHTML;
                        break;
                    }
                    if (oDummy) {
                        var oFound;
                        for (oFound = oDummy.firstChild; oFound; oFound = oFound.firstChild)
                            if (oFound.className == sId)
                                break;
                        if (oFound) {
                            for (var oChild; oChild = oEl.firstChild; )
                                oChild.removeNode(true);
                            for (var oChild = oFound.firstChild; oChild; oChild = oFound.firstChild) {
                                oEl.appendChild(oChild);
                            }
                            oDummy.removeNode && oDummy.removeNode(true);
                        }
                        oDummy = null;
                    }
                } else {
                    oEl.innerHTML = sHTML;
                }
                return this;
            }
            return this._element.innerHTML;
        }
    } else {
        jindo.$Element.prototype.html = function(sHTML) {
            if (typeof sHTML != "undefined" && arguments.length) {
                sHTML += "";
                var oEl = this._element;
                oEl.innerHTML = sHTML;
                return this;
            }
            return this._element.innerHTML;
        }
    }
    return this.html(sHTML);
}
;
jindo.$Element.prototype.outerHTML = function() {
    var e = this._element;
    if (typeof e.outerHTML != "undefined")
        return e.outerHTML;
    var oDoc = e.ownerDocument || e.document || document;
    var div = oDoc.createElement("div");
    var par = e.parentNode;
    if (!par)
        return e.innerHTML;
    par.insertBefore(div, e);
    div.style.display = "none";
    div.appendChild(e);
    var s = div.innerHTML;
    par.insertBefore(e, div);
    par.removeChild(div);
    return s;
}
;
jindo.$Element.prototype.toString = jindo.$Element.prototype.outerHTML;
jindo.$Element._getTransition = function() {
    var hasTransition = false
      , sTransitionName = "";
    if (typeof document.body.style.trasition != "undefined") {
        hasTransition = true;
        sTransitionName = "trasition";
    } else if (typeof document.body.style.webkitTransition !== "undefined") {
        hasTransition = true;
        sTransitionName = "webkitTransition";
    } else if (typeof document.body.style.OTransition !== "undefined") {
        hasTransition = true;
        sTransitionName = "OTransition";
    }
    return (jindo.$Element._getTransition = function() {
        return {
            "hasTransition": hasTransition,
            "name": sTransitionName
        };
    }
    )();
}
jindo.$Element.prototype.appear = function(duration, callback) {
    var oTransition = jindo.$Element._getTransition();
    if (oTransition.hasTransition) {
        jindo.$Element.prototype.appear = function(duration, callback) {
            duration = duration || 0.3;
            callback = callback || function() {}
            ;
            var bindFunc = function() {
                callback();
                this.show();
                this.removeEventListener(oTransition.name + "End", arguments.callee, false);
            };
            var ele = this._element;
            var self = this;
            if (!this.visible()) {
                ele.style.opacity = ele.style.opacity || 0;
                self.show();
            }
            ele.addEventListener(oTransition.name + "End", bindFunc, false);
            ele.style[oTransition.name + 'Property'] = 'opacity';
            ele.style[oTransition.name + 'Duration'] = duration + 's';
            ele.style[oTransition.name + 'TimingFunction'] = 'linear';
            setTimeout(function() {
                ele.style.opacity = '1';
            }, 1);
            return this;
        }
    } else {
        jindo.$Element.prototype.appear = function(duration, callback) {
            var self = this;
            var op = this.opacity();
            if (!this.visible())
                op = 0;
            if (op == 1)
                return this;
            try {
                clearTimeout(this._fade_timer);
            } catch (e) {}
            ;callback = callback || function() {}
            ;
            var step = (1 - op) / ((duration || 0.3) * 100);
            var func = function() {
                op += step;
                self.opacity(op);
                if (op >= 1) {
                    callback(self);
                } else {
                    self._fade_timer = setTimeout(func, 10);
                }
            };
            this.show();
            func();
            return this;
        }
    }
    return this.appear(duration, callback);
}
;
jindo.$Element.prototype.disappear = function(duration, callback) {
    var oTransition = jindo.$Element._getTransition();
    if (oTransition.hasTransition) {
        jindo.$Element.prototype.disappear = function(duration, callback) {
            duration = duration || 0.3
            var self = this;
            callback = callback || function() {}
            ;
            var bindFunc = function() {
                callback();
                this.removeEventListener(oTransition.name + "End", arguments.callee, false);
                self.hide();
            };
            var ele = this._element;
            ele.addEventListener(oTransition.name + "End", bindFunc, false);
            ele.style[oTransition.name + 'Property'] = 'opacity';
            ele.style[oTransition.name + 'Duration'] = duration + 's';
            ele.style[oTransition.name + 'TimingFunction'] = 'linear';
            setTimeout(function() {
                ele.style.opacity = '0';
            }, 1);
            return this;
        }
    } else {
        jindo.$Element.prototype.disappear = function(duration, callback) {
            var self = this;
            var op = this.opacity();
            if (op == 0)
                return this;
            try {
                clearTimeout(this._fade_timer);
            } catch (e) {}
            ;callback = callback || function() {}
            ;
            var step = op / ((duration || 0.3) * 100);
            var func = function() {
                op -= step;
                self.opacity(op);
                if (op <= 0) {
                    self.hide();
                    self.opacity(1);
                    callback(self);
                } else {
                    self._fade_timer = setTimeout(func, 10);
                }
            };
            func();
            return this;
        }
    }
    return this.disappear(duration, callback);
}
;
jindo.$Element.prototype.offset = function(nTop, nLeft) {
    var oEl = this._element;
    var oPhantom = null;
    if (typeof nTop == 'number' && typeof nLeft == 'number') {
        if (isNaN(parseInt(this.css('top'), 10)))
            this.css('top', 0);
        if (isNaN(parseInt(this.css('left'), 10)))
            this.css('left', 0);
        var oPos = this.offset();
        var oGap = {
            top: nTop - oPos.top,
            left: nLeft - oPos.left
        };
        oEl.style.top = parseInt(this.css('top'), 10) + oGap.top + 'px';
        oEl.style.left = parseInt(this.css('left'), 10) + oGap.left + 'px';
        return this;
    }
    var bSafari = /Safari/.test(navigator.userAgent);
    var bIE = /MSIE/.test(navigator.userAgent);
    var nVer = bIE ? navigator.userAgent.match(/(?:MSIE) ([0-9.]+)/)[1] : 0;
    var fpSafari = function(oEl) {
        var oPos = {
            left: 0,
            top: 0
        };
        for (var oParent = oEl, oOffsetParent = oParent.offsetParent; oParent = oParent.parentNode; ) {
            if (oParent.offsetParent) {
                oPos.left -= oParent.scrollLeft;
                oPos.top -= oParent.scrollTop;
            }
            if (oParent == oOffsetParent) {
                oPos.left += oEl.offsetLeft + oParent.clientLeft;
                oPos.top += oEl.offsetTop + oParent.clientTop;
                if (!oParent.offsetParent) {
                    oPos.left += oParent.offsetLeft;
                    oPos.top += oParent.offsetTop;
                }
                oOffsetParent = oParent.offsetParent;
                oEl = oParent;
            }
        }
        return oPos;
    };
    var fpOthers = function(oEl) {
        var oPos = {
            left: 0,
            top: 0
        };
        var oDoc = oEl.ownerDocument || oEl.document || document;
        var oHtml = oDoc.documentElement;
        var oBody = oDoc.body;
        if (oEl.getBoundingClientRect) {
            if (!oPhantom) {
                var bHasFrameBorder = (window == top);
                if (!bHasFrameBorder) {
                    try {
                        bHasFrameBorder = (window.frameElement && window.frameElement.frameBorder == 1);
                    } catch (e) {}
                }
                if ((bIE && nVer < 8 && window.external) && bHasFrameBorder) {
                    oPhantom = {
                        left: 2,
                        top: 2
                    };
                    oBase = null;
                } else {
                    oPhantom = {
                        left: 0,
                        top: 0
                    };
                }
            }
            var box = oEl.getBoundingClientRect();
            if (oEl !== oHtml && oEl !== oBody) {
                oPos.left = box.left - oPhantom.left;
                oPos.top = box.top - oPhantom.top;
                oPos.left += oHtml.scrollLeft || oBody.scrollLeft;
                oPos.top += oHtml.scrollTop || oBody.scrollTop;
            }
        } else if (oDoc.getBoxObjectFor) {
            var box = oDoc.getBoxObjectFor(oEl);
            var vpBox = oDoc.getBoxObjectFor(oHtml || oBody);
            oPos.left = box.screenX - vpBox.screenX;
            oPos.top = box.screenY - vpBox.screenY;
        } else {
            for (var o = oEl; o; o = o.offsetParent) {
                oPos.left += o.offsetLeft;
                oPos.top += o.offsetTop;
            }
            for (var o = oEl.parentNode; o; o = o.parentNode) {
                if (o.tagName == 'BODY')
                    break;
                if (o.tagName == 'TR')
                    oPos.top += 2;
                oPos.left -= o.scrollLeft;
                oPos.top -= o.scrollTop;
            }
        }
        return oPos;
    };
    return (bSafari ? fpSafari : fpOthers)(oEl);
}
;
jindo.$Element.prototype.evalScripts = function(sHTML) {
    var aJS = [];
    sHTML = sHTML.replace(new RegExp('<script(\\s[^>]+)*>(.*?)</' + 'script>','gi'), function(_1, _2, sPart) {
        aJS.push(sPart);
        return '';
    });
    eval(aJS.join('\n'));
    return this;
}
;
jindo.$Element._append = function(oParent, oChild) {
    if (typeof oChild == "string") {
        oChild = jindo.$(oChild);
    } else if (oChild instanceof jindo.$Element) {
        oChild = oChild.$value();
    }
    oParent._element.appendChild(oChild);
    return oParent;
}
jindo.$Element._prepend = function(oParent, oChild) {
    if (typeof oParent == "string") {
        oParent = jindo.$(oParent);
    } else if (oParent instanceof jindo.$Element) {
        oParent = oParent.$value();
    }
    var nodes = oParent.childNodes;
    if (nodes.length > 0) {
        oParent.insertBefore(oChild._element, nodes[0]);
    } else {
        oParent.appendChild(oChild._element);
    }
    return oChild;
}
jindo.$Element.prototype.append = function(oElement) {
    return jindo.$Element._append(this, oElement);
}
;
jindo.$Element.prototype.prepend = function(oElement) {
    return jindo.$Element._prepend(this._element, jindo.$Element(oElement));
}
;
jindo.$Element.prototype.replace = function(oElement) {
    jindo.$$.release();
    var e = this._element;
    var oParentNode = e.parentNode;
    var o = jindo.$Element(oElement);
    if (oParentNode && oParentNode.replaceChild) {
        oParentNode.replaceChild(o.$value(), e);
        return o;
    }
    var o = o.$value();
    oParentNode.insertBefore(o, e);
    oParentNode.removeChild(e);
    return o;
}
;
jindo.$Element.prototype.appendTo = function(oElement) {
    var ele = jindo.$Element(oElement);
    jindo.$Element._append(ele, this._element);
    return ele;
}
;
jindo.$Element.prototype.prependTo = function(oElement) {
    jindo.$Element._prepend(oElement, this);
    return jindo.$Element(oElement);
}
;
jindo.$Element.prototype.before = function(oElement) {
    var oRich = jindo.$Element(oElement);
    var o = oRich.$value();
    this._element.parentNode.insertBefore(o, this._element);
    return oRich;
}
;
jindo.$Element.prototype.after = function(oElement) {
    var o = this.before(oElement);
    o.before(this);
    return o;
}
;
jindo.$Element.prototype.parent = function(pFunc, limit) {
    var e = this._element;
    var a = []
      , p = null;
    if (typeof pFunc == "undefined")
        return jindo.$Element(e.parentNode);
    if (typeof limit == "undefined" || limit == 0)
        limit = -1;
    while (e.parentNode && limit-- != 0) {
        p = jindo.$Element(e.parentNode);
        if (e.parentNode == document.documentElement)
            break;
        if (!pFunc || (pFunc && pFunc(p)))
            a[a.length] = p;
        e = e.parentNode;
    }
    return a;
}
;
jindo.$Element.prototype.child = function(pFunc, limit) {
    var e = this._element;
    var a = []
      , c = null
      , f = null;
    if (typeof pFunc == "undefined")
        return jindo.$A(e.childNodes).filter(function(v) {
            return v.nodeType == 1
        }).map(function(v) {
            return jindo.$Element(v)
        }).$value();
    if (typeof limit == "undefined" || limit == 0)
        limit = -1;
    (f = function(el, lim) {
        var ch = null
          , o = null;
        for (var i = 0; i < el.childNodes.length; i++) {
            ch = el.childNodes[i];
            if (ch.nodeType != 1)
                continue;
            o = jindo.$Element(el.childNodes[i]);
            if (!pFunc || (pFunc && pFunc(o)))
                a[a.length] = o;
            if (lim != 0)
                f(el.childNodes[i], lim - 1);
        }
    }
    )(e, limit - 1);
    return a;
}
;
jindo.$Element.prototype.prev = function(pFunc) {
    var e = this._element;
    var a = [];
    var b = (typeof pFunc == "undefined");
    if (!e)
        return b ? jindo.$Element(null) : a;
    do {
        e = e.previousSibling;
        if (!e || e.nodeType != 1)
            continue;
        if (b)
            return jindo.$Element(e);
        if (!pFunc || pFunc(e))
            a[a.length] = jindo.$Element(e);
    } while (e);
    return b ? jindo.$Element(e) : a;
}
;
jindo.$Element.prototype.next = function(pFunc) {
    var e = this._element;
    var a = [];
    var b = (typeof pFunc == "undefined");
    if (!e)
        return b ? jindo.$Element(null) : a;
    do {
        e = e.nextSibling;
        if (!e || e.nodeType != 1)
            continue;
        if (b)
            return jindo.$Element(e);
        if (!pFunc || pFunc(e))
            a[a.length] = jindo.$Element(e);
    } while (e);
    return b ? jindo.$Element(e) : a;
}
;
jindo.$Element.prototype.first = function() {
    var el = this._element.firstElementChild || this._element.firstChild;
    if (!el)
        return null;
    while (el && el.nodeType != 1)
        el = el.nextSibling;
    return el ? jindo.$Element(el) : null;
}
jindo.$Element.prototype.last = function() {
    var el = this._element.lastElementChild || this._element.lastChild;
    if (!el)
        return null;
    while (el && el.nodeType != 1)
        el = el.previousSibling;
    return el ? jindo.$Element(el) : null;
}
jindo.$Element.prototype.isChildOf = function(element) {
    return jindo.$Element._contain(jindo.$Element(element).$value(), this._element);
}
;
jindo.$Element.prototype.isParentOf = function(element) {
    return jindo.$Element._contain(this._element, jindo.$Element(element).$value());
}
;
jindo.$Element._contain = function(eParent, eChild) {
    if (document.compareDocumentPosition) {
        jindo.$Element._contain = function(eParent, eChild) {
            return !!(eParent.compareDocumentPosition(eChild) & 16);
        }
    } else if (document.body.contains) {
        jindo.$Element._contain = function(eParent, eChild) {
            return (eParent !== eChild) && (eParent.contains ? eParent.contains(eChild) : true);
        }
    } else {
        jindo.$Element._contain = function(eParent, eChild) {
            var e = eParent;
            var el = eChild;
            while (e && e.parentNode) {
                e = e.parentNode;
                if (e == el)
                    return true;
            }
            return false;
        }
    }
    return jindo.$Element._contain(eParent, eChild);
}
jindo.$Element.prototype.isEqual = function(element) {
    try {
        return (this._element === jindo.$Element(element).$value());
    } catch (e) {
        return false;
    }
}
;
jindo.$Element.prototype.fireEvent = function(sEvent, oProps) {
    function IE(sEvent, oProps) {
        sEvent = (sEvent + "").toLowerCase();
        var oEvent = document.createEventObject();
        if (oProps) {
            for (k in oProps) {
                if (oProps.hasOwnProperty(k))
                    oEvent[k] = oProps[k];
            }
            oEvent.button = (oProps.left ? 1 : 0) + (oProps.middle ? 4 : 0) + (oProps.right ? 2 : 0);
            oEvent.relatedTarget = oProps.relatedElement || null;
        }
        this._element.fireEvent("on" + sEvent, oEvent);
        return this;
    }
    ;function DOM2(sEvent, oProps) {
        var sType = "HTMLEvents";
        sEvent = (sEvent + "").toLowerCase();
        if (sEvent == "click" || sEvent.indexOf("mouse") == 0) {
            sType = "MouseEvent";
            if (sEvent == "mousewheel")
                sEvent = "dommousescroll";
        } else if (sEvent.indexOf("key") == 0) {
            sType = "KeyboardEvent";
        }
        var evt;
        if (oProps) {
            oProps.button = 0 + (oProps.middle ? 1 : 0) + (oProps.right ? 2 : 0);
            oProps.ctrl = oProps.ctrl || false;
            oProps.alt = oProps.alt || false;
            oProps.shift = oProps.shift || false;
            oProps.meta = oProps.meta || false;
            switch (sType) {
            case 'MouseEvent':
                evt = document.createEvent(sType);
                evt.initMouseEvent(sEvent, true, true, null, oProps.detail || 0, oProps.screenX || 0, oProps.screenY || 0, oProps.clientX || 0, oProps.clientY || 0, oProps.ctrl, oProps.alt, oProps.shift, oProps.meta, oProps.button, oProps.relatedElement || null);
                break;
            case 'KeyboardEvent':
                if (window.KeyEvent) {
                    evt = document.createEvent('KeyEvents');
                    evt.initKeyEvent(sEvent, true, true, window, oProps.ctrl, oProps.alt, oProps.shift, oProps.meta, oProps.keyCode, oProps.keyCode);
                } else {
                    try {
                        evt = document.createEvent("Events");
                    } catch (e) {
                        evt = document.createEvent("UIEvents");
                    } finally {
                        evt.initEvent(sEvent, true, true);
                        evt.ctrlKey = oProps.ctrl;
                        evt.altKey = oProps.alt;
                        evt.shiftKey = oProps.shift;
                        evt.metaKey = oProps.meta;
                        evt.keyCode = oProps.keyCode;
                        evt.which = oProps.keyCode;
                    }
                }
                break;
            default:
                evt = document.createEvent(sType);
                evt.initEvent(sEvent, true, true);
            }
        } else {
            evt = document.createEvent(sType);
            evt.initEvent(sEvent, true, true);
        }
        this._element.dispatchEvent(evt);
        return this;
    }
    ;jindo.$Element.prototype.fireEvent = (typeof this._element.dispatchEvent != "undefined") ? DOM2 : IE;
    return this.fireEvent(sEvent, oProps);
}
;
jindo.$Element.prototype.empty = function() {
    jindo.$$.release();
    this.html("");
    return this;
}
;
jindo.$Element.prototype.remove = function(oChild) {
    jindo.$$.release();
    jindo.$Element(oChild).leave();
    return this;
}
jindo.$Element.prototype.leave = function() {
    var e = this._element;
    if (e.parentNode) {
        jindo.$$.release();
        e.parentNode.removeChild(e);
    }
    jindo.$Fn.freeElement(this._element);
    return this;
}
;
jindo.$Element.prototype.wrap = function(wrapper) {
    var e = this._element;
    wrapper = jindo.$Element(wrapper).$value();
    if (e.parentNode) {
        e.parentNode.insertBefore(wrapper, e);
    }
    wrapper.appendChild(e);
    return this;
}
;
jindo.$Element.prototype.ellipsis = function(stringTail) {
    stringTail = stringTail || "...";
    var txt = this.text();
    var len = txt.length;
    var padding = parseInt(this.css("paddingTop"), 10) + parseInt(this.css("paddingBottom"), 10);
    var cur_h = this.height() - padding;
    var i = 0;
    var h = this.text('A').height() - padding;
    if (cur_h < h * 1.5)
        return this.text(txt);
    cur_h = h;
    while (cur_h < h * 1.5) {
        i += Math.max(Math.ceil((len - i) / 2), 1);
        cur_h = this.text(txt.substring(0, i) + stringTail).height() - padding;
    }
    while (cur_h > h * 1.5) {
        i--;
        cur_h = this.text(txt.substring(0, i) + stringTail).height() - padding;
    }
}
;
jindo.$Element.prototype.indexOf = function(element) {
    try {
        var e = jindo.$Element(element).$value();
        var n = this._element.childNodes;
        var c = 0;
        var l = n.length;
        for (var i = 0; i < l; i++) {
            if (n[i].nodeType != 1)
                continue;
            if (n[i] === e)
                return c;
            c++;
        }
    } catch (e) {}
    return -1;
}
;
jindo.$Element.prototype.queryAll = function(sSelector) {
    return jindo.$$(sSelector, this._element);
}
;
jindo.$Element.prototype.query = function(sSelector) {
    return jindo.$$.getSingle(sSelector, this._element);
}
;
jindo.$Element.prototype.test = function(sSelector) {
    return jindo.$$.test(this._element, sSelector);
}
;
jindo.$Element.prototype.xpathAll = function(sXPath) {
    return jindo.$$.xpath(sXPath, this._element);
}
;
jindo.$Element.insertAdjacentHTML = function(ins, html, insertType, type, fn) {
    var _ele = ins._element;
    if (_ele.insertAdjacentHTML && !(/^<(option|tr|td|th|col)(?:.*?)>/.test(html.replace(/^(\s|　)+|(\s|　)+$/g, "").toLowerCase()))) {
        _ele.insertAdjacentHTML(insertType, html);
    } else {
        var oDoc = _ele.ownerDocument || _ele.document || document;
        var fragment = oDoc.createDocumentFragment();
        var defaultElement;
        var sTag = html.replace(/^(\s|　)+|(\s|　)+$/g, "");
        var oParentTag = {
            "option": "select",
            "tr": "tbody",
            "thead": "table",
            "tbody": "table",
            "col": "table",
            "td": "tr",
            "th": "tr",
            "div": "div"
        }
        var aMatch = /^\<(option|tr|thead|tbody|td|th|col)(?:.*?)\>/i.exec(sTag);
        var sChild = aMatch === null ? "div" : aMatch[1].toLowerCase();
        var sParent = oParentTag[sChild];
        defaultElement = jindo._createEle(sParent, sTag, oDoc, true);
        var scripts = defaultElement.getElementsByTagName("script");
        for (var i = 0, l = scripts.length; i < l; i++) {
            scripts[i].parentNode.removeChild(scripts[i]);
        }
        while (defaultElement[type]) {
            fragment.appendChild(defaultElement[type]);
        }
        fn(fragment.cloneNode(true));
    }
    return ins;
}
jindo.$Element.prototype.appendHTML = function(sHTML) {
    return jindo.$Element.insertAdjacentHTML(this, sHTML, "beforeEnd", "firstChild", jindo.$Fn(function(oEle) {
        this.append(oEle);
    }, this).bind());
}
;
jindo.$Element.prototype.prependHTML = function(sHTML) {
    return jindo.$Element.insertAdjacentHTML(this, sHTML, "afterBegin", "lastChild", jindo.$Fn(function(oEle) {
        this.prepend(oEle);
    }, this).bind());
}
;
jindo.$Element.prototype.beforeHTML = function(sHTML) {
    return jindo.$Element.insertAdjacentHTML(this, sHTML, "beforeBegin", "firstChild", jindo.$Fn(function(oEle) {
        this.before(oEle);
    }, this).bind());
}
;
jindo.$Element.prototype.afterHTML = function(sHTML) {
    return jindo.$Element.insertAdjacentHTML(this, sHTML, "afterEnd", "lastChild", jindo.$Fn(function(oEle) {
        this._element.parentNode.insertBefore(oEle, this._element.nextSibling);
    }, this).bind());
}
;
jindo.$Element.prototype.delegate = function(sEvent, vFilter, fpCallback) {
    if (!this._element["_delegate_" + sEvent]) {
        this._element["_delegate_" + sEvent] = {};
        var fAroundFunc = jindo.$Fn(function(sEvent, wEvent) {
            wEvent = wEvent || window.event;
            if (typeof wEvent.currentTarget == "undefined") {
                wEvent.currentTarget = this._element;
            }
            var oEle = wEvent.target || wEvent.srcElement;
            var aData = this._element["_delegate_" + sEvent];
            var data, func, event, resultFilter;
            for (var i in aData) {
                data = aData[i];
                resultFilter = data.checker(oEle);
                if (resultFilter[0]) {
                    func = data.func;
                    event = jindo.$Event(wEvent);
                    event.element = resultFilter[1];
                    for (var j = 0, l = func.length; j < l; j++) {
                        func[j](event);
                    }
                }
            }
        }, this).bind(sEvent);
        jindo.$Element._eventBind(this._element, sEvent, fAroundFunc);
        var oEle = this._element;
        oEle["_delegate_" + sEvent + "_func"] = fAroundFunc;
        if (this._element["_delegate_events"]) {
            this._element["_delegate_events"].push(sEvent);
        } else {
            this._element["_delegate_events"] = [sEvent];
        }
        oEle = null;
    }
    this._bind(sEvent, vFilter, fpCallback);
    return this;
}
jindo.$Element._eventBind = function(oEle, sEvent, fAroundFunc) {
    if (oEle.addEventListener) {
        jindo.$Element._eventBind = function(oEle, sEvent, fAroundFunc) {
            oEle.addEventListener(sEvent, fAroundFunc, false);
        }
    } else {
        jindo.$Element._eventBind = function(oEle, sEvent, fAroundFunc) {
            oEle.attachEvent("on" + sEvent, fAroundFunc);
        }
    }
    jindo.$Element._eventBind(oEle, sEvent, fAroundFunc);
}
jindo.$Element.prototype.undelegate = function(sEvent, vFilter, fpCallback) {
    this._unbind(sEvent, vFilter, fpCallback);
    return this;
}
jindo.$Element.prototype._bind = function(sEvent, vFilter, fpCallback) {
    var _aDataOfEvent = this._element["_delegate_" + sEvent];
    if (_aDataOfEvent) {
        var fpCheck;
        if (typeof vFilter == "string") {
            fpCheck = jindo.$Fn(function(sCssquery, oEle) {
                var eIncludeEle = oEle;
                var isIncludeEle = jindo.$$.test(oEle, sCssquery);
                if (!isIncludeEle) {
                    var aPropagationElements = this._getParent(oEle);
                    for (var i = 0, leng = aPropagationElements.length; i < leng; i++) {
                        eIncludeEle = aPropagationElements[i];
                        if (jindo.$$.test(eIncludeEle, sCssquery)) {
                            isIncludeEle = true;
                            break;
                        }
                    }
                }
                return [isIncludeEle, eIncludeEle];
            }, this).bind(vFilter);
        } else if (typeof vFilter == "function") {
            fpCheck = jindo.$Fn(function(fpFilter, oEle) {
                var eIncludeEle = oEle;
                var isIncludeEle = fpFilter(this._element, oEle);
                if (!isIncludeEle) {
                    var aPropagationElements = this._getParent(oEle);
                    for (var i = 0, leng = aPropagationElements.length; i < leng; i++) {
                        eIncludeEle = aPropagationElements[i];
                        if (fpFilter(this._element, eIncludeEle)) {
                            isIncludeEle = true;
                            break;
                        }
                    }
                }
                return [isIncludeEle, eIncludeEle];
            }, this).bind(vFilter);
        }
        this._element["_delegate_" + sEvent] = jindo.$Element._addBind(_aDataOfEvent, vFilter, fpCallback, fpCheck);
    } else {
        alert("check your delegate event.");
    }
}
jindo.$Element.prototype._getParent = function(oEle) {
    var e = this._element;
    var a = []
      , p = null;
    while (oEle.parentNode && p != e) {
        p = oEle.parentNode;
        if (p == document.documentElement)
            break;
        a[a.length] = p;
        oEle = p;
    }
    return a;
}
;
jindo.$Element._addBind = function(aDataOfEvent, vFilter, fpCallback, fpCheck) {
    var aEvent = aDataOfEvent[vFilter];
    if (aEvent) {
        var fpFuncs = aEvent.func;
        fpFuncs.push(fpCallback);
        aEvent.func = fpFuncs;
    } else {
        aEvent = {
            checker: fpCheck,
            func: [fpCallback]
        };
    }
    aDataOfEvent[vFilter] = aEvent
    return aDataOfEvent;
}
jindo.$Element.prototype._unbind = function(sEvent, vFilter, fpCallback) {
    var oEle = this._element;
    if (sEvent && vFilter && fpCallback) {
        var oEventInfo = oEle["_delegate_" + sEvent];
        if (oEventInfo && oEventInfo[vFilter]) {
            var fpFuncs = oEventInfo[vFilter].func;
            fpFuncs = oEventInfo[vFilter].func = jindo.$A(fpFuncs).refuse(fpCallback).$value();
            if (!fpFuncs.length) {
                jindo.$Element._deleteFilter(oEle, sEvent, vFilter);
            }
        }
    } else if (sEvent && vFilter) {
        jindo.$Element._deleteFilter(oEle, sEvent, vFilter);
    } else if (sEvent) {
        jindo.$Element._deleteEvent(oEle, sEvent, vFilter);
    } else {
        var aEvents = oEle['_delegate_events'];
        var sEachEvent;
        for (var i = 0, l = aEvents.length; i < l; i++) {
            sEachEvent = aEvents[i];
            jindo.$Element._unEventBind(oEle, sEachEvent, oEle["_delegate_" + sEachEvent + "_func"]);
            jindo.$Element._delDelegateInfo(oEle, "_delegate_" + sEachEvent);
            jindo.$Element._delDelegateInfo(oEle, "_delegate_" + sEachEvent + "_func");
        }
        jindo.$Element._delDelegateInfo(oEle, "_delegate_events");
    }
    return this;
}
jindo.$Element._delDelegateInfo = function(oObj, sType) {
    try {
        oObj[sType] = null;
        delete oObj[sType];
    } catch (e) {}
    return oObj
}
jindo.$Element._deleteFilter = function(oEle, sEvent, vFilter) {
    var oEventInfo = oEle["_delegate_" + sEvent];
    if (oEventInfo && oEventInfo[vFilter]) {
        if (jindo.$H(oEventInfo).keys().length == 1) {
            jindo.$Element._deleteEvent(oEle, sEvent, vFilter);
        } else {
            jindo.$Element._delDelegateInfo(oEventInfo, vFilter);
        }
    }
}
jindo.$Element._deleteEvent = function(oEle, sEvent, vFilter) {
    var aEvents = oEle['_delegate_events'];
    jindo.$Element._unEventBind(oEle, sEvent, oEle["_delegate_" + sEvent + "_func"]);
    jindo.$Element._delDelegateInfo(oEle, "_delegate_" + sEvent);
    jindo.$Element._delDelegateInfo(oEle, "_delegate_" + sEvent + "_func");
    aEvents = jindo.$A(aEvents).refuse(sEvent).$value();
    if (!aEvents.length) {
        jindo.$Element._delDelegateInfo(oEle, "_delegate_events");
    } else {
        oEle['_delegate_events'] = jindo.$A(aEvents).refuse(sEvent).$value();
    }
}
jindo.$Element._unEventBind = function(oEle, sType, fAroundFunc) {
    if (oEle.removeEventListener) {
        jindo.$Element._unEventBind = function(oEle, sType, fAroundFunc) {
            oEle.removeEventListener(sType, fAroundFunc, false);
        }
    } else {
        jindo.$Element._unEventBind = function(oEle, sType, fAroundFunc) {
            oEle.detachEvent("on" + sType, fAroundFunc);
        }
    }
    jindo.$Element._unEventBind(oEle, sType, fAroundFunc);
}
jindo.$Fn = function(func, thisObject) {
    var cl = arguments.callee;
    if (func instanceof cl)
        return func;
    if (!(this instanceof cl))
        return new cl(func,thisObject);
    this._events = [];
    this._tmpElm = null;
    this._key = null;
    if (typeof func == "function") {
        this._func = func;
        this._this = thisObject;
    } else if (typeof func == "string" && typeof thisObject == "string") {
        this._func = eval("false||function(" + func + "){" + thisObject + "}")
    }
}
var _ua = navigator.userAgent;
jindo.$Fn.prototype.$value = function() {
    return this._func;
}
;
jindo.$Fn.prototype.bind = function() {
    var a = jindo.$A(arguments).$value();
    var f = this._func;
    var t = this._this;
    var b = function() {
        var args = jindo.$A(arguments).$value();
        if (a.length)
            args = a.concat(args);
        return f.apply(t, args);
    };
    return b;
}
;
jindo.$Fn.prototype.bindForEvent = function() {
    var a = arguments;
    var f = this._func;
    var t = this._this;
    var m = this._tmpElm || null;
    var b = function(e) {
        var args = Array.prototype.slice.apply(a);
        if (typeof e == "undefined")
            e = window.event;
        if (typeof e.currentTarget == "undefined") {
            e.currentTarget = m;
        }
        var oEvent = jindo.$Event(e);
        args.unshift(oEvent);
        var returnValue = f.apply(t, args);
        if (typeof returnValue != "undefined" && oEvent.type == "beforeunload") {
            e.returnValue = returnValue;
        }
        return returnValue;
    };
    return b;
}
;
jindo.$Fn.prototype.attach = function(oElement, sEvent, bUseCapture) {
    var fn = null, l, ev = sEvent, el = oElement, ua = _ua;
    if (typeof bUseCapture == "undefined") {
        bUseCapture = false;
    }
    ;this._bUseCapture = bUseCapture;
    if ((el instanceof Array) || (jindo.$A && (el instanceof jindo.$A) && (el = el.$value()))) {
        for (var i = 0; i < el.length; i++)
            this.attach(el[i], ev, bUseCapture);
        return this;
    }
    if (!el || !ev)
        return this;
    if (typeof el.$value == "function")
        el = el.$value();
    el = jindo.$(el);
    ev = ev.toLowerCase();
    this._tmpElm = el;
    fn = this.bindForEvent();
    this._tmpElm = null;
    var bIsIE = ua.indexOf("MSIE") > -1;
    if (typeof el.addEventListener != "undefined") {
        if (ev == "domready") {
            ev = "DOMContentLoaded";
        } else if (ev == "mousewheel" && ua.indexOf("WebKit") < 0 && !/Opera/.test(ua) && !bIsIE) {
            ev = "DOMMouseScroll";
        } else if (ev == "mouseenter" && !bIsIE) {
            ev = "mouseover";
            fn = jindo.$Fn._fireWhenElementBoundary(el, fn);
        } else if (ev == "mouseleave" && !bIsIE) {
            ev = "mouseout";
            fn = jindo.$Fn._fireWhenElementBoundary(el, fn);
        } else if (ev == "transitionend" || ev == "transitionstart") {
            var sPrefix, sPostfix = ev.replace("transition", "");
            sPostfix = sPostfix.substr(0, 1).toUpperCase() + sPostfix.substr(1);
            if (typeof document.body.style.WebkitTransition !== "undefined") {
                sPrefix = "webkit";
            } else if (typeof document.body.style.OTransition !== "undefined") {
                sPrefix = "o";
            } else if (typeof document.body.style.MsTransition !== "undefined") {
                sPrefix = "ms";
            }
            ev = (sPrefix ? sPrefix + "Transition" : "transition") + sPostfix;
            this._for_test_attach = ev;
            this._for_test_detach = "";
        } else if (ev == "animationstart" || ev == "animationend" || ev == "animationiteration") {
            var sPrefix, sPostfix = ev.replace("animation", "");
            sPostfix = sPostfix.substr(0, 1).toUpperCase() + sPostfix.substr(1);
            if (typeof document.body.style.WebkitAnimationName !== "undefined") {
                sPrefix = "webkit";
            } else if (typeof document.body.style.OAnimationName !== "undefined") {
                sPrefix = "o";
            } else if (typeof document.body.style.MsTransitionName !== "undefined") {
                sPrefix = "ms";
            }
            ev = (sPrefix ? sPrefix + "Animation" : "animation") + sPostfix;
            this._for_test_attach = ev;
            this._for_test_detach = "";
        }
        el.addEventListener(ev, fn, bUseCapture);
    } else if (typeof el.attachEvent != "undefined") {
        if (ev == "domready") {
            if (window.top != window)
                throw new Error("Domready Event doesn't work in the iframe.");
            jindo.$Fn._domready(el, fn);
            return this;
        } else {
            el.attachEvent("on" + ev, fn);
        }
    }
    if (!this._key) {
        this._key = "$" + jindo.$Fn.gc.count++;
        jindo.$Fn.gc.pool[this._key] = this;
    }
    this._events[this._events.length] = {
        element: el,
        event: sEvent.toLowerCase(),
        func: fn
    };
    return this;
}
;
jindo.$Fn.prototype.detach = function(oElement, sEvent) {
    var fn = null, l, el = oElement, ev = sEvent, ua = _ua;
    if ((el instanceof Array) || (jindo.$A && (el instanceof jindo.$A) && (el = el.$value()))) {
        for (var i = 0; i < el.length; i++)
            this.detach(el[i], ev);
        return this;
    }
    if (!el || !ev)
        return this;
    if (jindo.$Element && el instanceof jindo.$Element)
        el = el.$value();
    el = jindo.$(el);
    ev = ev.toLowerCase();
    var e = this._events;
    for (var i = 0; i < e.length; i++) {
        if (e[i].element !== el || e[i].event !== ev)
            continue;
        fn = e[i].func;
        this._events = jindo.$A(this._events).refuse(e[i]).$value();
        break;
    }
    if (typeof el.removeEventListener != "undefined") {
        if (ev == "domready") {
            ev = "DOMContentLoaded";
        } else if (ev == "mousewheel" && ua.indexOf("WebKit") < 0) {
            ev = "DOMMouseScroll";
        } else if (ev == "mouseenter") {
            ev = "mouseover";
        } else if (ev == "mouseleave") {
            ev = "mouseout";
        } else if (ev == "transitionend" || ev == "transitionstart") {
            var sPrefix, sPostfix = ev.replace("transition", "");
            sPostfix = sPostfix.substr(0, 1).toUpperCase() + sPostfix.substr(1);
            if (typeof document.body.style.WebkitTransition !== "undefined") {
                sPrefix = "webkit";
            } else if (typeof document.body.style.OTransition !== "undefined") {
                sPrefix = "o";
            } else if (typeof document.body.style.MsTransition !== "undefined") {
                sPrefix = "ms";
            }
            ev = (sPrefix ? sPrefix + "Transition" : "transition") + sPostfix;
            this._for_test_detach = ev;
            this._for_test_attach = "";
        } else if (ev == "animationstart" || ev == "animationend" || ev == "animationiteration") {
            var sPrefix, sPostfix = ev.replace("animation", "");
            sPostfix = sPostfix.substr(0, 1).toUpperCase() + sPostfix.substr(1);
            if (typeof document.body.style.WebkitAnimationName !== "undefined") {
                sPrefix = "webkit";
            } else if (typeof document.body.style.OAnimationName !== "undefined") {
                sPrefix = "o";
            } else if (typeof document.body.style.MsTransitionName !== "undefined") {
                sPrefix = "ms";
            }
            ev = (sPrefix ? sPrefix + "Animation" : "animation") + sPostfix;
            this._for_test_detach = ev;
            this._for_test_attach = "";
        }
        if (fn)
            el.removeEventListener(ev, fn, false);
    } else if (typeof el.detachEvent != "undefined") {
        if (ev == "domready") {
            jindo.$Fn._domready.list = jindo.$Fn._domready.list.refuse(fn);
            return this;
        } else {
            el.detachEvent("on" + ev, fn);
        }
    }
    return this;
}
;
jindo.$Fn.prototype.delay = function(nSec, args) {
    if (typeof args == "undefined")
        args = [];
    this._delayKey = setTimeout(this.bind.apply(this, args), nSec * 1000);
    return this;
}
;
jindo.$Fn.prototype.setInterval = function(nSec, args) {
    if (typeof args == "undefined")
        args = [];
    this._repeatKey = setInterval(this.bind.apply(this, args), nSec * 1000);
    return this._repeatKey;
}
;
jindo.$Fn.prototype.repeat = jindo.$Fn.prototype.setInterval;
jindo.$Fn.prototype.stopDelay = function() {
    if (typeof this._delayKey != "undefined") {
        window.clearTimeout(this._delayKey);
        delete this._delayKey;
    }
    return this;
}
jindo.$Fn.prototype.stopRepeat = function() {
    if (typeof this._repeatKey != "undefined") {
        window.clearInterval(this._repeatKey);
        delete this._repeatKey;
    }
    return this;
}
jindo.$Fn.prototype.free = function(oElement) {
    var len = this._events.length;
    while (len > 0) {
        var el = this._events[--len].element;
        var sEvent = this._events[len].event;
        var fn = this._events[len].func;
        if (oElement && el !== oElement) {
            continue;
        }
        this.detach(el, sEvent);
        var isGCCall = !oElement;
        if (isGCCall && window === el && sEvent == "unload" && _ua.indexOf("MSIE") < 1) {
            this._func.call(this._this);
        }
        delete this._events[len];
    }
    if (this._events.length == 0)
        try {
            delete jindo.$Fn.gc.pool[this._key];
        } catch (e) {}
    ;
}
;
jindo.$Fn._domready = function(doc, func) {
    if (typeof jindo.$Fn._domready.list == "undefined") {
        var f = null
          , l = jindo.$Fn._domready.list = jindo.$A([func]);
        var done = false
          , execFuncs = function() {
            if (!done) {
                done = true;
                var evt = {
                    type: "domready",
                    target: doc,
                    currentTarget: doc
                };
                while (f = l.shift())
                    f(evt);
            }
        };
        (function() {
            try {
                doc.documentElement.doScroll("left");
            } catch (e) {
                setTimeout(arguments.callee, 50);
                return;
            }
            execFuncs();
        }
        )();
        doc.onreadystatechange = function() {
            if (doc.readyState == 'complete') {
                doc.onreadystatechange = null;
                execFuncs();
            }
        }
        ;
    } else {
        jindo.$Fn._domready.list.push(func);
    }
}
;
jindo.$Fn._fireWhenElementBoundary = function(doc, func) {
    return function(evt) {
        var oEvent = jindo.$Event(evt);
        var relatedElement = jindo.$Element(oEvent.relatedElement);
        if (relatedElement && (relatedElement.isEqual(this) || relatedElement.isChildOf(this)))
            return;
        func.call(this, evt);
    }
}
;
jindo.$Fn.gc = function() {
    var p = jindo.$Fn.gc.pool;
    for (var key in p) {
        if (p.hasOwnProperty(key))
            try {
                p[key].free();
            } catch (e) {}
        ;
    }
    jindo.$Fn.gc.pool = p = {};
}
;
jindo.$Fn.freeElement = function(oElement) {
    var p = jindo.$Fn.gc.pool;
    for (var key in p) {
        if (p.hasOwnProperty(key)) {
            try {
                p[key].free(oElement);
            } catch (e) {}
            ;
        }
    }
}
jindo.$Fn.gc.count = 0;
jindo.$Fn.gc.pool = {};
var _ua = navigator.userAgent;
if (typeof window != "undefined" && !(_ua.indexOf("IEMobile") == -1 && _ua.indexOf("Mobile") > -1 && _ua.indexOf("Safari") > -1)) {
    jindo.$Fn(jindo.$Fn.gc).attach(window, "unload");
}
jindo.$Event = function(e) {
    var cl = arguments.callee;
    if (e instanceof cl)
        return e;
    if (!(this instanceof cl))
        return new cl(e);
    if (typeof e == "undefined")
        e = window.event;
    if (e === window.event && document.createEventObject)
        e = document.createEventObject(e);
    this._event = e;
    this._globalEvent = window.event;
    this.type = e.type.toLowerCase();
    if (this.type == "dommousescroll") {
        this.type = "mousewheel";
    } else if (this.type == "domcontentloaded") {
        this.type = "domready";
    }
    this.canceled = false;
    this.element = e.target || e.srcElement;
    this.currentElement = e.currentTarget;
    this.relatedElement = null;
    if (typeof e.relatedTarget != "undefined") {
        this.relatedElement = e.relatedTarget;
    } else if (e.fromElement && e.toElement) {
        this.relatedElement = e[(this.type == "mouseout") ? "toElement" : "fromElement"];
    }
}
jindo.$Event.prototype.mouse = function() {
    var e = this._event;
    var delta = 0;
    var left = false
      , mid = false
      , right = false;
    var left = e.which ? e.button == 0 : !!(e.button & 1);
    var mid = e.which ? e.button == 1 : !!(e.button & 4);
    var right = e.which ? e.button == 2 : !!(e.button & 2);
    var ret = {};
    if (e.wheelDelta) {
        delta = e.wheelDelta / 120;
    } else if (e.detail) {
        delta = -e.detail / 3;
    }
    ret = {
        delta: delta,
        left: left,
        middle: mid,
        right: right
    };
    this.mouse = function() {
        return ret
    }
    ;
    return ret;
}
;
jindo.$Event.prototype.key = function() {
    var e = this._event;
    var k = e.keyCode || e.charCode;
    var ret = {
        keyCode: k,
        alt: e.altKey,
        ctrl: e.ctrlKey,
        meta: e.metaKey,
        shift: e.shiftKey,
        up: (k == 38),
        down: (k == 40),
        left: (k == 37),
        right: (k == 39),
        enter: (k == 13),
        esc: (k == 27)
    };
    this.key = function() {
        return ret
    }
    ;
    return ret;
}
;
jindo.$Event.prototype.pos = function(bGetOffset) {
    var e = this._event;
    var b = (this.element.ownerDocument || document).body;
    var de = (this.element.ownerDocument || document).documentElement;
    var pos = [b.scrollLeft || de.scrollLeft, b.scrollTop || de.scrollTop];
    var ret = {
        clientX: e.clientX,
        clientY: e.clientY,
        pageX: 'pageX'in e ? e.pageX : e.clientX + pos[0] - b.clientLeft,
        pageY: 'pageY'in e ? e.pageY : e.clientY + pos[1] - b.clientTop,
        layerX: 'offsetX'in e ? e.offsetX : e.layerX - 1,
        layerY: 'offsetY'in e ? e.offsetY : e.layerY - 1
    };
    if (bGetOffset && jindo.$Element) {
        var offset = jindo.$Element(this.element).offset();
        ret.offsetX = ret.pageX - offset.left;
        ret.offsetY = ret.pageY - offset.top;
    }
    return ret;
}
;
jindo.$Event.prototype.stop = function(nCancel) {
    nCancel = nCancel || jindo.$Event.CANCEL_ALL;
    var e = (window.event && window.event == this._globalEvent) ? this._globalEvent : this._event;
    var b = !!(nCancel & jindo.$Event.CANCEL_BUBBLE);
    var d = !!(nCancel & jindo.$Event.CANCEL_DEFAULT);
    this.canceled = true;
    if (typeof e.preventDefault != "undefined" && d)
        e.preventDefault();
    if (typeof e.stopPropagation != "undefined" && b)
        e.stopPropagation();
    if (d)
        e.returnValue = false;
    if (b)
        e.cancelBubble = true;
    return this;
}
;
jindo.$Event.prototype.stopDefault = function() {
    return this.stop(jindo.$Event.CANCEL_DEFAULT);
}
jindo.$Event.prototype.stopBubble = function() {
    return this.stop(jindo.$Event.CANCEL_BUBBLE);
}
jindo.$Event.prototype.$value = function() {
    return this._event;
}
;
jindo.$Event.CANCEL_BUBBLE = 1;
jindo.$Event.CANCEL_DEFAULT = 2;
jindo.$Event.CANCEL_ALL = 3;
jindo.$ElementList = function(els) {
    var cl = arguments.callee;
    if (els instanceof cl)
        return els;
    if (!(this instanceof cl))
        return new cl(els);
    if (els instanceof Array) {
        els = jindo.$A(els);
    } else if (jindo.$A && els instanceof jindo.$A) {
        els = jindo.$A(els.$value());
    } else if (typeof els == "string" && jindo.cssquery) {
        els = jindo.$A(jindo.cssquery(els));
    } else {
        els = jindo.$A();
    }
    this._elements = els.map(function(v, i, a) {
        return jindo.$Element(v)
    });
}
jindo.$ElementList.prototype.get = function(idx) {
    return this._elements.$value()[idx];
}
;
jindo.$ElementList.prototype.getFirst = function() {
    return this.get(0);
}
;
jindo.$ElementList.prototype.length = function(nLen, oValue) {
    return this._elements.length(nLen, oValue);
}
jindo.$ElementList.prototype.getLast = function() {
    return this.get(Math.max(this._elements.length() - 1, 0));
}
;
jindo.$ElementList.prototype.$value = function() {
    return this._elements.$value();
}
;
(function(proto) {
    var setters = ['show', 'hide', 'toggle', 'addClass', 'removeClass', 'toggleClass', 'fireEvent', 'leave', 'empty', 'appear', 'disappear', 'className', 'width', 'height', 'text', 'html', 'css', 'attr'];
    jindo.$A(setters).forEach(function(name) {
        proto[name] = function() {
            var args = jindo.$A(arguments).$value();
            this._elements.forEach(function(el) {
                el[name].apply(el, args);
            });
            return this;
        }
    });
    jindo.$A(['appear', 'disappear']).forEach(function(name) {
        proto[name] = function(duration, callback) {
            var len = this._elements.length;
            var self = this;
            this._elements.forEach(function(el, idx) {
                if (idx == len - 1) {
                    el[name](duration, function() {
                        callback(self)
                    });
                } else {
                    el[name](duration);
                }
            });
            return this;
        }
    });
}
)(jindo.$ElementList.prototype);
jindo.$S = function(str) {
    var cl = arguments.callee;
    if (typeof str == "undefined")
        str = "";
    if (str instanceof cl)
        return str;
    if (!(this instanceof cl))
        return new cl(str);
    this._str = str + "";
}
jindo.$S.prototype.$value = function() {
    return this._str;
}
;
jindo.$S.prototype.toString = jindo.$S.prototype.$value;
jindo.$S.prototype.trim = function() {
    if ("".trim) {
        jindo.$S.prototype.trim = function() {
            return jindo.$S(this._str.trim());
        }
    } else {
        jindo.$S.prototype.trim = function() {
            return jindo.$S(this._str.replace(/^(\s|　)+/g, "").replace(/(\s|　)+$/g, ""));
        }
    }
    return jindo.$S(this.trim());
}
;
jindo.$S.prototype.escapeHTML = function() {
    var entities = {
        '"': 'quot',
        '&': 'amp',
        '<': 'lt',
        '>': 'gt',
        '\'': '#39'
    };
    var s = this._str.replace(/[<>&"']/g, function(m0) {
        return entities[m0] ? '&' + entities[m0] + ';' : m0;
    });
    return jindo.$S(s);
}
;
jindo.$S.prototype.stripTags = function() {
    return jindo.$S(this._str.replace(/<\/?(?:h[1-5]|[a-z]+(?:\:[a-z]+)?)[^>]*>/ig, ''));
}
;
jindo.$S.prototype.times = function(nTimes) {
    var buf = [];
    for (var i = 0; i < nTimes; i++) {
        buf[buf.length] = this._str;
    }
    return jindo.$S(buf.join(''));
}
;
jindo.$S.prototype.unescapeHTML = function() {
    var entities = {
        'quot': '"',
        'amp': '&',
        'lt': '<',
        'gt': '>',
        '#39': '\''
    };
    var s = this._str.replace(/&([a-z]+|#[0-9]+);/g, function(m0, m1) {
        return entities[m1] ? entities[m1] : m0;
    });
    return jindo.$S(s);
}
;
jindo.$S.prototype.escape = function() {
    var s = this._str.replace(/([\u0080-\uFFFF]+)|[\n\r\t"'\\]/g, function(m0, m1, _) {
        if (m1)
            return escape(m1).replace(/%/g, '\\');
        return (_ = {
            "\n": "\\n",
            "\r": "\\r",
            "\t": "\\t"
        })[m0] ? _[m0] : "\\" + m0;
    });
    return jindo.$S(s);
}
;
jindo.$S.prototype.bytes = function(vConfig) {
    var code = 0
      , bytes = 0
      , i = 0
      , len = this._str.length;
    var charset = ((document.charset || document.characterSet || document.defaultCharset) + "");
    var cut, nBytes;
    if (typeof vConfig == "undefined") {
        cut = false;
    } else if (vConfig.constructor == Number) {
        cut = true;
        nBytes = vConfig;
    } else if (vConfig.constructor == Object) {
        charset = vConfig.charset || charset;
        nBytes = vConfig.size || false;
        cut = !!nBytes;
    } else {
        cut = false;
    }
    if (charset.toLowerCase() == "utf-8") {
        for (i = 0; i < len; i++) {
            code = this._str.charCodeAt(i);
            if (code < 128) {
                bytes += 1;
            } else if (code < 2048) {
                bytes += 2;
            } else if (code < 65536) {
                bytes += 3;
            } else {
                bytes += 4;
            }
            if (cut && bytes > nBytes) {
                this._str = this._str.substr(0, i);
                break;
            }
        }
    } else {
        for (i = 0; i < len; i++) {
            bytes += (this._str.charCodeAt(i) > 128) ? 2 : 1;
            if (cut && bytes > nBytes) {
                this._str = this._str.substr(0, i);
                break;
            }
        }
    }
    return cut ? this : bytes;
}
;
jindo.$S.prototype.parseString = function() {
    if (this._str == "")
        return {};
    var str = this._str.split(/&/g), pos, key, val, buf = {}, isescape = false;
    for (var i = 0; i < str.length; i++) {
        key = str[i].substring(0, pos = str[i].indexOf("=")),
        isescape = false;
        try {
            val = decodeURIComponent(str[i].substring(pos + 1));
        } catch (e) {
            isescape = true;
            val = decodeURIComponent(unescape(str[i].substring(pos + 1)));
        }
        if (key.substr(key.length - 2, 2) == "[]") {
            key = key.substring(0, key.length - 2);
            if (typeof buf[key] == "undefined")
                buf[key] = [];
            buf[key][buf[key].length] = isescape ? escape(val) : val;
            ;
        } else {
            buf[key] = isescape ? escape(val) : val;
        }
    }
    return buf;
}
;
jindo.$S.prototype.escapeRegex = function() {
    var s = this._str;
    var r = /([\?\.\*\+\-\/\(\)\{\}\[\]\:\!\^\$\\\|])/g;
    return jindo.$S(s.replace(r, "\\$1"));
}
;
jindo.$S.prototype.format = function() {
    var args = arguments;
    var idx = 0;
    var s = this._str.replace(/%([ 0])?(-)?([1-9][0-9]*)?([bcdsoxX])/g, function(m0, m1, m2, m3, m4) {
        var a = args[idx++];
        var ret = ""
          , pad = "";
        m3 = m3 ? +m3 : 0;
        if (m4 == "s") {
            ret = a + "";
        } else if (" bcdoxX".indexOf(m4) > 0) {
            if (typeof a != "number")
                return "";
            ret = (m4 == "c") ? String.fromCharCode(a) : a.toString(({
                b: 2,
                d: 10,
                o: 8,
                x: 16,
                X: 16
            })[m4]);
            if (" X".indexOf(m4) > 0)
                ret = ret.toUpperCase();
        }
        if (ret.length < m3)
            pad = jindo.$S(m1 || " ").times(m3 - ret.length).toString();
        (m2 == '-') ? (ret += pad) : (ret = pad + ret);
        return ret;
    });
    return jindo.$S(s);
}
;
jindo.$Document = function(el) {
    var cl = arguments.callee;
    if (el instanceof cl)
        return el;
    if (!(this instanceof cl))
        return new cl(el);
    this._doc = el || document;
    this._docKey = this.renderingMode() == 'Standards' ? 'documentElement' : 'body';
}
;
jindo.$Document.prototype.$value = function() {
    return this._doc;
}
;
jindo.$Document.prototype.scrollSize = function() {
    var isWebkit = navigator.userAgent.indexOf("WebKit") > -1;
    var oDoc = this._doc[isWebkit ? 'body' : this._docKey];
    return {
        width: Math.max(oDoc.scrollWidth, oDoc.clientWidth),
        height: Math.max(oDoc.scrollHeight, oDoc.clientHeight)
    };
}
;
jindo.$Document.prototype.scrollPosition = function() {
    var isWebkit = navigator.userAgent.indexOf("WebKit") > -1;
    var oDoc = this._doc[isWebkit ? 'body' : this._docKey];
    return {
        left: oDoc.scrollLeft || window.pageXOffset || window.scrollX || 0,
        top: oDoc.scrollTop || window.pageYOffset || window.scrollY || 0
    };
}
;
jindo.$Document.prototype.clientSize = function() {
    var agent = navigator.userAgent;
    var oDoc = this._doc[this._docKey];
    var isSafari = agent.indexOf("WebKit") > -1 && agent.indexOf("Chrome") == -1;
    return (isSafari) ? {
        width: window.innerWidth,
        height: window.innerHeight
    } : {
        width: oDoc.clientWidth,
        height: oDoc.clientHeight
    };
}
;
jindo.$Document.prototype.renderingMode = function() {
    var agent = navigator.userAgent;
    var isIe = (typeof window.opera == "undefined" && agent.indexOf("MSIE") > -1);
    var isSafari = (agent.indexOf("WebKit") > -1 && agent.indexOf("Chrome") < 0 && navigator.vendor.indexOf("Apple") > -1);
    var sRet;
    if ('compatMode'in this._doc) {
        sRet = this._doc.compatMode == 'CSS1Compat' ? 'Standards' : (isIe ? 'Quirks' : 'Almost');
    } else {
        sRet = isSafari ? 'Standards' : 'Quirks';
    }
    return sRet;
}
;
jindo.$Document.prototype.queryAll = function(sSelector) {
    return jindo.$$(sSelector, this._doc);
}
;
jindo.$Document.prototype.query = function(sSelector) {
    return jindo.$$.getSingle(sSelector, this._doc);
}
;
jindo.$Document.prototype.xpathAll = function(sXPath) {
    return jindo.$$.xpath(sXPath, this._doc);
}
;
jindo.$Form = function(el) {
    var cl = arguments.callee;
    if (el instanceof cl)
        return el;
    if (!(this instanceof cl))
        return new cl(el);
    el = jindo.$(el);
    if (!el.tagName || el.tagName.toUpperCase() != 'FORM')
        throw new Error('The element should be a FORM element');
    this._form = el;
}
jindo.$Form.prototype.$value = function() {
    return this._form;
}
;
jindo.$Form.prototype.serialize = function() {
    var self = this;
    var oRet = {};
    var nLen = arguments.length;
    var fpInsert = function(sKey) {
        var sVal = self.value(sKey);
        if (typeof sVal != 'undefined')
            oRet[sKey] = sVal;
    };
    if (nLen == 0) {
        jindo.$A(this.element()).forEach(function(o) {
            if (o.name)
                fpInsert(o.name);
        });
    } else {
        for (var i = 0; i < nLen; i++) {
            fpInsert(arguments[i]);
        }
    }
    return jindo.$H(oRet).toQueryString();
}
;
jindo.$Form.prototype.element = function(sKey) {
    if (arguments.length > 0)
        return this._form[sKey];
    return this._form.elements;
}
;
jindo.$Form.prototype.enable = function() {
    var sKey = arguments[0];
    if (typeof sKey == 'object') {
        var self = this;
        jindo.$H(sKey).forEach(function(bFlag, sKey) {
            self.enable(sKey, bFlag);
        });
        return this;
    }
    var aEls = this.element(sKey);
    if (!aEls)
        return this;
    aEls = aEls.nodeType == 1 ? [aEls] : aEls;
    if (arguments.length < 2) {
        var bEnabled = true;
        jindo.$A(aEls).forEach(function(o) {
            if (o.disabled) {
                bEnabled = false;
                jindo.$A.Break();
            }
        });
        return bEnabled;
    } else {
        var sFlag = arguments[1];
        jindo.$A(aEls).forEach(function(o) {
            o.disabled = !sFlag;
        });
        return this;
    }
}
;
jindo.$Form.prototype.value = function(sKey) {
    if (typeof sKey == 'object') {
        var self = this;
        jindo.$H(sKey).forEach(function(bFlag, sKey) {
            self.value(sKey, bFlag);
        });
        return this;
    }
    var aEls = this.element(sKey);
    if (!aEls)
        throw new Error('엘리먼트는 존재하지 않습니다.');
    aEls = aEls.nodeType == 1 ? [aEls] : aEls;
    if (arguments.length > 1) {
        var sVal = arguments[1];
        jindo.$A(aEls).forEach(function(o) {
            switch (o.type) {
            case 'radio':
                o.checked = (o.value == sVal);
                break;
            case 'checkbox':
                if (sVal.constructor == Array) {
                    o.checked = jindo.$A(sVal).has(o.value);
                } else {
                    o.checked = (o.value == sVal);
                }
                break;
            case 'select-one':
                var nIndex = -1;
                for (var i = 0, len = o.options.length; i < len; i++) {
                    if (o.options[i].value == sVal)
                        nIndex = i;
                }
                o.selectedIndex = nIndex;
                break;
            case 'select-multiple':
                var nIndex = -1;
                if (sVal.constructor == Array) {
                    var waVal = jindo.$A(sVal);
                    for (var i = 0, len = o.options.length; i < len; i++) {
                        o.options[i].selected = waVal.has(o.options[i].value);
                    }
                } else {
                    for (var i = 0, len = o.options.length; i < len; i++) {
                        if (o.options[i].value == sVal)
                            nIndex = i;
                    }
                    o.selectedIndex = nIndex;
                }
                break;
            default:
                o.value = sVal;
                break;
            }
        });
        return this;
    }
    var aRet = [];
    jindo.$A(aEls).forEach(function(o) {
        switch (o.type) {
        case 'radio':
        case 'checkbox':
            if (o.checked)
                aRet.push(o.value);
            break;
        case 'select-one':
            if (o.selectedIndex != -1)
                aRet.push(o.options[o.selectedIndex].value);
            break;
        case 'select-multiple':
            if (o.selectedIndex != -1) {
                for (var i = 0, len = o.options.length; i < len; i++) {
                    if (o.options[i].selected)
                        aRet.push(o.options[i].value);
                }
            }
            break;
        default:
            aRet.push(o.value);
            break;
        }
    });
    return aRet.length > 1 ? aRet : aRet[0];
}
;
jindo.$Form.prototype.submit = function(sTargetName, fValidation) {
    var sOrgTarget = null;
    if (typeof sTargetName == 'string') {
        sOrgTarget = this._form.target;
        this._form.target = sTargetName;
    }
    if (typeof sTargetName == 'function')
        fValidation = sTargetName;
    if (typeof fValidation != 'undefined') {
        if (!fValidation(this._form))
            return this;
    }
    this._form.submit();
    if (sOrgTarget !== null)
        this._form.target = sOrgTarget;
    return this;
}
;
jindo.$Form.prototype.reset = function(fValidation) {
    if (typeof fValidation != 'undefined') {
        if (!fValidation(this._form))
            return this;
    }
    this._form.reset();
    return this;
}
;
jindo.$Template = function(str) {
    var obj = null
      , tag = "";
    var cl = arguments.callee;
    if (str instanceof cl)
        return str;
    if (!(this instanceof cl))
        return new cl(str);
    if (typeof str == "undefined") {
        str = "";
    } else if ((obj = document.getElementById(str) || str) && obj.tagName && (tag = obj.tagName.toUpperCase()) && (tag == "TEXTAREA" || (tag == "SCRIPT" && obj.getAttribute("type") == "text/template"))) {
        str = (obj.value || obj.innerHTML).replace(/^\s+|\s+$/g, "");
    }
    this._str = str + "";
}
jindo.$Template.splitter = /(?!\\)[\{\}]/g;
jindo.$Template.pattern = /^(?:if (.+)|elseif (.+)|for (?:(.+)\:)?(.+) in (.+)|(else)|\/(if|for)|=(.+)|js (.+)|set (.+))$/;
jindo.$Template.prototype.process = function(data) {
    var key = "\x01";
    var leftBrace = "\x02";
    var rightBrace = "\x03";
    var tpl = (" " + this._str + " ").replace(/\\{/g, leftBrace).replace(/\\}/g, rightBrace).replace(/(?!\\)\}\{/g, "}" + key + "{").split(jindo.$Template.splitter)
      , i = tpl.length;
    var map = {
        '"': '\\"',
        '\\': '\\\\',
        '\n': '\\n',
        '\r': '\\r',
        '\t': '\\t',
        '\f': '\\f'
    };
    var reg = [/(["'](?:(?:\\.)+|[^\\["']+)*["']|[a-zA-Z_][\w\.]*)/g, /[\n\r\t\f"\\]/g, /^\s+/, /\s+$/, /#/g];
    var cb = [function(m) {
        return (m.substring(0, 1) == '"' || m.substring(0, 1) == '\'' || m == 'null') ? m : "d." + m;
    }
    , function(m) {
        return map[m] || m
    }
    , "", ""];
    var stm = [];
    var lev = 0;
    tpl[0] = tpl[0].substr(1);
    tpl[i - 1] = tpl[i - 1].substr(0, tpl[i - 1].length - 1);
    if (i < 2)
        return tpl[0];
    tpl = jindo.$A(tpl).reverse().$value();
    var delete_info;
    while (i--) {
        if (i % 2) {
            tpl[i] = tpl[i].replace(jindo.$Template.pattern, function() {
                var m = arguments;
                if (m[10]) {
                    return m[10].replace(/(\w+)(?:\s*)=(?:\s*)(?:([a-zA-Z0-9_]+)|(.+))$/g, function() {
                        var mm = arguments;
                        var str = "d." + mm[1] + "=";
                        if (mm[2]) {
                            str += "d." + mm[2];
                        } else {
                            str += mm[3].replace(/(=(?:[a-zA-Z_][\w\.]*)+)/g, function(m) {
                                return (m.substring(0, 1) == '=') ? "d." + m.replace('=', '') : m;
                            });
                        }
                        return str;
                    }) + ";";
                }
                if (m[9]) {
                    return 's[i++]=' + m[9].replace(/(=(?:[a-zA-Z_][\w\.]*)+)/g, function(m) {
                        return (m.substring(0, 1) == '=') ? "d." + m.replace('=', '') : m;
                    }) + ';';
                }
                if (m[8])
                    return 's[i++]= d.' + m[8] + ';';
                if (m[1]) {
                    return 'if(' + m[1].replace(reg[0], cb[0]).replace(/d\.(typeof) /, '$1 ').replace(/ d\.(instanceof) d\./, ' $1 ') + '){';
                }
                if (m[2])
                    return '}else if(' + m[2].replace(reg[0], cb[0]).replace(/d\.(typeof) /, '$1 ').replace(/ d\.(instanceof) d\./, ' $1 ') + '){';
                if (m[5]) {
                    delete_info = m[4];
                    var _aStr = [];
                    _aStr.push('var t#=d.' + m[5] + '||{},p#=isArray(t#),i#=0;');
                    _aStr.push('for(var x# in t#){');
                    _aStr.push('if(!t#.hasOwnProperty(x#)){continue;}');
                    _aStr.push(' if( (p# && isNaN(i#=parseInt(x#,10))) || (!p# && !t#.propertyIsEnumerable(x#)) ) continue;');
                    _aStr.push(' d.' + m[4] + '=t#[x#];');
                    _aStr.push(m[3] ? 'd.' + m[3] + '=p#?i#:x#;' : '');
                    return _aStr.join("").replace(reg[4], lev++);
                }
                if (m[6])
                    return '}else{';
                if (m[7]) {
                    if (m[7] == "for") {
                        return "delete d." + delete_info + "; };";
                    } else {
                        return '};';
                    }
                }
                return m[0];
            });
        } else if (tpl[i] == key) {
            tpl[i] = "";
        } else if (tpl[i]) {
            tpl[i] = 's[i++]="' + tpl[i].replace(reg[1], cb[1]) + '";';
        }
    }
    tpl = jindo.$A(tpl).reverse().$value().join('').replace(new RegExp(leftBrace,'g'), "{").replace(new RegExp(rightBrace,'g'), "}");
    var _aStr = [];
    _aStr.push('var s=[],i=0;');
    _aStr.push('function isArray(o){ return Object.prototype.toString.call(o) == "[object Array]" };');
    _aStr.push(tpl);
    _aStr.push('return s.join("");');
    tpl = eval("false||function(d){" + _aStr.join("") + "}");
    tpl = tpl(data);
    return tpl;
}
;
jindo.$Date = function(src) {
    var a = arguments
      , t = "";
    var cl = arguments.callee;
    if (src && src instanceof cl)
        return src;
    if (!(this instanceof cl))
        return new cl(a[0],a[1],a[2],a[3],a[4],a[5],a[6]);
    if ((t = typeof src) == "string") {
        if (/(\d\d\d\d)(?:-?(\d\d)(?:-?(\d\d)))/.test(src)) {
            try {
                this._date = new Date(src);
                if (!this._date.toISOString) {
                    this._date = jindo.$Date.makeISO(src);
                } else if (this._date.toISOString() == "Invalid Date") {
                    this._date = jindo.$Date.makeISO(src);
                }
            } catch (e) {
                this._date = jindo.$Date.makeISO(src);
            }
        } else {
            this._date = cl.parse(src);
        }
    } else if (t == "number") {
        if (typeof a[1] == "undefined") {
            this._date = new Date(src);
        } else {
            for (var i = 0; i < 7; i++) {
                if (typeof a[i] != "number") {
                    a[i] = 1;
                }
            }
            this._date = new Date(a[0],a[1],a[2],a[3],a[4],a[5],a[6]);
        }
    } else if (t == "object" && src.constructor == Date) {
        (this._date = new Date).setTime(src.getTime());
        this._date.setMilliseconds(src.getMilliseconds());
    } else {
        this._date = new Date;
    }
    this._names = {};
    for (var i in jindo.$Date.names) {
        if (jindo.$Date.names.hasOwnProperty(i))
            this._names[i] = jindo.$Date.names[i];
    }
}
jindo.$Date.makeISO = function(src) {
    var match = src.match(/(\d\d\d\d)(?:-?(\d\d)(?:-?(\d\d)(?:[T ](\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|(?:([-+])(\d\d)(?::?(\d\d))?)?)?)?)?)?/);
    var hour = parseInt(match[4] || 0, 10);
    var min = parseInt(match[5] || 0, 10);
    if (match[8] == "Z") {
        hour += jindo.$Date.utc;
    } else if (match[9] == "+" || match[9] == "-") {
        hour += (jindo.$Date.utc - parseInt(match[9] + match[10], 10));
        min += parseInt(match[9] + match[11], 10);
    }
    return new Date(match[1] || 0,parseInt(match[2] || 0, 10) - 1,match[3] || 0,hour,min,match[6] || 0,match[7] || 0);
}
jindo.$Date.names = {
    month: ["January", "Febrary", "March", "April", "May", "June", "July", "August", "September", "October", "Novermber", "December"],
    s_month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    day: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    s_day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    ampm: ["AM", "PM"]
};
jindo.$Date.utc = 9;
jindo.$Date.now = function() {
    return Date.now();
}
;
jindo.$Date.prototype.name = function(oNames) {
    if (arguments.length) {
        for (var i in oNames) {
            if (oNames.hasOwnProperty(i))
                this._names[i] = oNames[i];
        }
    } else {
        return this._names;
    }
}
jindo.$Date.parse = function(strDate) {
    return new Date(Date.parse(strDate));
}
;
jindo.$Date.prototype.$value = function() {
    return this._date;
}
;
jindo.$Date.prototype.format = function(strFormat) {
    var o = {};
    var d = this._date;
    var name = this.name();
    var self = this;
    return (strFormat || "").replace(/[a-z]/ig, function callback(m) {
        if (typeof o[m] != "undefined")
            return o[m];
        switch (m) {
        case "d":
        case "j":
            o.j = d.getDate();
            o.d = (o.j > 9 ? "" : "0") + o.j;
            return o[m];
        case "l":
        case "D":
        case "w":
        case "N":
            o.w = d.getDay();
            o.N = o.w ? o.w : 7;
            o.D = name.s_day[o.w];
            o.l = name.day[o.w];
            return o[m];
        case "S":
            return (!!(o.S = ["st", "nd", "rd"][d.getDate()])) ? o.S : (o.S = "th");
        case "z":
            o.z = Math.floor((d.getTime() - (new Date(d.getFullYear(),0,1)).getTime()) / (3600 * 24 * 1000));
            return o.z;
        case "m":
        case "n":
            o.n = d.getMonth() + 1;
            o.m = (o.n > 9 ? "" : "0") + o.n;
            return o[m];
        case "L":
            o.L = self.isLeapYear();
            return o.L;
        case "o":
        case "Y":
        case "y":
            o.o = o.Y = d.getFullYear();
            o.y = (o.o + "").substr(2);
            return o[m];
        case "a":
        case "A":
        case "g":
        case "G":
        case "h":
        case "H":
            o.G = d.getHours();
            o.g = (o.g = o.G % 12) ? o.g : 12;
            o.A = o.G < 12 ? name.ampm[0] : name.ampm[1];
            o.a = o.A.toLowerCase();
            o.H = (o.G > 9 ? "" : "0") + o.G;
            o.h = (o.g > 9 ? "" : "0") + o.g;
            return o[m];
        case "i":
            o.i = (((o.i = d.getMinutes()) > 9) ? "" : "0") + o.i;
            return o.i;
        case "s":
            o.s = (((o.s = d.getSeconds()) > 9) ? "" : "0") + o.s;
            return o.s;
        case "u":
            o.u = d.getMilliseconds();
            return o.u;
        case "U":
            o.U = self.time();
            return o.U;
        default:
            return m;
        }
    });
}
;
jindo.$Date.prototype.time = function(nTime) {
    if (typeof nTime == "number") {
        this._date.setTime(nTime);
        return this;
    }
    return this._date.getTime();
}
;
jindo.$Date.prototype.year = function(nYear) {
    if (typeof nYear == "number") {
        this._date.setFullYear(nYear);
        return this;
    }
    return this._date.getFullYear();
}
;
jindo.$Date.prototype.month = function(nMon) {
    if (typeof nMon == "number") {
        this._date.setMonth(nMon);
        return this;
    }
    return this._date.getMonth();
}
;
jindo.$Date.prototype.date = function(nDate) {
    if (typeof nDate == "number") {
        this._date.setDate(nDate);
        return this;
    }
    return this._date.getDate();
}
;
jindo.$Date.prototype.day = function() {
    return this._date.getDay();
}
;
jindo.$Date.prototype.hours = function(nHour) {
    if (typeof nHour == "number") {
        this._date.setHours(nHour);
        return this;
    }
    return this._date.getHours();
}
;
jindo.$Date.prototype.minutes = function(nMin) {
    if (typeof nMin == "number") {
        this._date.setMinutes(nMin);
        return this;
    }
    return this._date.getMinutes();
}
;
jindo.$Date.prototype.seconds = function(nSec) {
    if (typeof nSec == "number") {
        this._date.setSeconds(nSec);
        return this;
    }
    return this._date.getSeconds();
}
;
jindo.$Date.prototype.isLeapYear = function() {
    var y = this._date.getFullYear();
    return !(y % 4) && !!(y % 100) || !(y % 400);
}
;
jindo.$Window = function(el) {
    var cl = arguments.callee;
    if (el instanceof cl)
        return el;
    if (!(this instanceof cl))
        return new cl(el);
    this._win = el || window;
}
jindo.$Window.prototype.$value = function() {
    return this._win;
}
;
jindo.$Window.prototype.resizeTo = function(nWidth, nHeight) {
    this._win.resizeTo(nWidth, nHeight);
    return this;
}
;
jindo.$Window.prototype.resizeBy = function(nWidth, nHeight) {
    this._win.resizeBy(nWidth, nHeight);
    return this;
}
;
jindo.$Window.prototype.moveTo = function(nLeft, nTop) {
    this._win.moveTo(nLeft, nTop);
    return this;
}
;
jindo.$Window.prototype.moveBy = function(nLeft, nTop) {
    this._win.moveBy(nLeft, nTop);
    return this;
}
;
jindo.$Window.prototype.sizeToContent = function(nWidth, nHeight) {
    if (typeof this._win.sizeToContent == "function") {
        this._win.sizeToContent();
    } else {
        if (arguments.length != 2) {
            var innerX, innerY;
            var self = this._win;
            var doc = this._win.document;
            if (self.innerHeight) {
                innerX = self.innerWidth;
                innerY = self.innerHeight;
            } else if (doc.documentElement && doc.documentElement.clientHeight) {
                innerX = doc.documentElement.clientWidth;
                innerY = doc.documentElement.clientHeight;
            } else if (doc.body) {
                innerX = doc.body.clientWidth;
                innerY = doc.body.clientHeight;
            }
            var pageX, pageY;
            var test1 = doc.body.scrollHeight;
            var test2 = doc.body.offsetHeight;
            if (test1 > test2) {
                pageX = doc.body.scrollWidth;
                pageY = doc.body.scrollHeight;
            } else {
                pageX = doc.body.offsetWidth;
                pageY = doc.body.offsetHeight;
            }
            nWidth = pageX - innerX;
            nHeight = pageY - innerY;
        }
        this.resizeBy(nWidth, nHeight);
    }
    return this;
}
;
