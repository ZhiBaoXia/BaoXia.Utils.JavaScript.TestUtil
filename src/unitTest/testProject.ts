import { TestCase } from "./testCase.js";
import { TestCaseAsync } from "./testCaseAsync.js";

export class TestProject
{
	////////////////////////////////////////////////
	// @自身属性
	////////////////////////////////////////////////

	name: string;
	testCases: Array<TestCase | TestCaseAsync>;


	////////////////////////////////////////////////
	// @自身实现
	////////////////////////////////////////////////

	constructor(
		name: string,
		testCases: Array<TestCase | TestCaseAsync>)
	{
		this.name = name;
		this.testCases = testCases;
	}

	async testAsync()
	{
		try
		{
			let testCases = this.testCases;
			let testCasesCount = testCases.length;
			console.log("测试开始，共 " + testCasesCount + " 个用例待进行。");

			let testCasesCountWithTestSuccess = 0;
			let testCasesCountWithTestFailed = 0;

			for (let testCaseIndex = 0;
				testCaseIndex < testCasesCount;
				testCaseIndex++)
			{
				let testCaseOriginal = testCases[testCaseIndex];
				let testName: string | null = null;
				let testException = null;
				if (testCaseOriginal instanceof TestCase)
				{
					let testCase = testCaseOriginal as TestCase;
					testName = testCase.name;
					let testCaseNumber = testCaseIndex + 1;
					let testProgressCaption = testCaseNumber + "/" + testCasesCount;
					let testCaseNameCaption = "第 " + testProgressCaption + " 个用例，" + testCase.name;
					console.log("\r\n" + testCaseNameCaption + "，测试开始...");
					{
						testCase.pretest();
						//
						testException = testCase.test();
						//
						testCase.tested();

						if (testException == null)
						{
							testCasesCountWithTestSuccess++;
						}
						else
						{
							testCasesCountWithTestFailed++;
						}
					}
				}
				else if (testCaseOriginal instanceof TestCaseAsync)
				{
					let testCaseAsync = testCaseOriginal as TestCaseAsync;
					testName = testCaseAsync.name;
					let testCaseNumber = testCaseIndex + 1;
					let testProgressCaption = testCaseNumber + "/" + testCasesCount;
					let testCaseNameCaption = "第 " + testProgressCaption + " 个用例，" + testCaseAsync.name;
					console.log("\r\n" + testCaseNameCaption + "，测试开始...");
					{
						let testException: unknown | null = null;
						try
						{
							testCaseAsync.pretest();
							//
							await testCaseAsync.testAsync();
							//
							testCaseAsync.tested();
						}
						catch (exception)
						{
							testException = exception;
						}
						if (testException == null)
						{
							testCasesCountWithTestSuccess++;
						}
						else
						{
							testCasesCountWithTestFailed++;
						}
					}
				}

				let testResult: string;
				if (testException != null)
				{
					testResult = "❌\t" + testName + "，未通过测试：\r\n" + testException;
				}
				else
				{
					testResult = "✔\t" + testName + "，通过测试。";
				}
				console.log(testResult);
			}
			if (testCasesCountWithTestFailed > 0)
			{
				console.log("\r\n💣💣💣\t" + this.name + "，未通过测试，共 " + testCasesCountWithTestFailed + "/" + testCasesCount + " 个用例，未通过测试。\r\n");
			}
			else
			{
				console.log("\r\n🎉🎉🎉\t" + this.name + "，通过测试，共 " + testCasesCount + " 个用例，全部通过测试！\r\n");
			}
		}
		catch (exception)
		{
			console.error("\r\n💣💣💣\t" + this.name + "，未通过测试，测试项目程序异常：\r\n" + exception + "\r\n");
		}
	}
}