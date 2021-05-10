const testTypes=require("./types"),{error:error,dbg:dbg,dg:dg,dr:dr,dy:dy,header:header}=require("@nexssp/logdebug"),{yellow:yellow,bold:bold,magenta:magenta,green:green}=require("@nexssp/ansi"),path=require("path"),{inspect:inspect}=require("util"),subtest=(allTests,{file:file,value:value,display:display=!1,chdir:chdir,stopOnError:stopOnError}={})=>{allTests.nexsstests||(error("check:",file),process.exit(1));let totalOk=0,totalFailed=0,keepchdir=null;const rrr=allTests.nexsstests.map((subtestItem=>{subtestItem.file=file,subtestItem.title?subtestItem.title=-1!==subtestItem.title.indexOf("$")&&value?evalTS(subtestItem.title,value):subtestItem.title:subtestItem.title=subtestItem.params[0];const typeOfTest=subtestItem.type||allTests.defaultType||"shouldContain";subtestItem.testType=typeOfTest,subtestItem.params||(error("check:",file),error("No parames on test",subtestItem.title),process.exit(1));const testBody=`${subtestItem.params[0]} ${typeOfTest} -> ${subtestItem.params[1]}`;header(),console.log(bold(green(`${value}, ${subtestItem.title}`))),console.log(`FILE:  ${magenta(bold(file))}`),dbg(`${bold(yellow(evalTS(subtestItem.params[0],value)))}\n${bold(yellow(typeOfTest))}  ==>\n ${bold(subtestItem.params[1])}`,bold(inspect(subtestItem.params[2]))),subtestItem.params[2]&&subtestItem.params[2].keepchdir&&(keepchdir=subtestItem.params[2].keepchdir,dy(bold(`Set keepchdir: ${keepchdir}`)),subtestItem.params[2].chdir=keepchdir),chdir&&keepchdir&&(path.isAbsolute(keepchdir)||(chdir+=`/${keepchdir}`),keepchdir=chdir),!chdir&&keepchdir&&(chdir=keepchdir),dy(bold("chdir is: ",chdir));const testExecuteResult=eval(testTypes[typeOfTest])(...subtestItem.params.map((e=>null!==e&&"object"==typeof e||allTests.notEval||subtestItem.notEval?e:evalTS(e,value))),{chdir:chdir,testFunction:subtestItem.testFunction});return subtestItem.result=testExecuteResult,subtestItem.testBody=testBody,testExecuteResult?(dg(bold("OK.\n")),subtestItem.ok=!0,totalOk++):(error(bold("FAILED: "+file)),error(bold("title: "+subtestItem.title)),error(bold(subtestItem.params.reduce(((e,t)=>e+=`\n${inspect(t)}`),""))),subtestItem.ok=!1,totalFailed++,stopOnError&&process.exit(1)),subtestItem}));return{file:file,results:rrr,totalOk:totalOk,totalFailed:totalFailed}};function evalTS(v,uniqueTestValue){return eval("`"+v+"`")}module.exports={subtest:subtest};