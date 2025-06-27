
import { AssertFailedError } from "./assertFailedError.js";

////////////////////////////////////////////////
// TestCaseAsync
////////////////////////////////////////////////

export class TestCaseAsync
{
	////////////////////////////////////////////////
	// @自身属性
	////////////////////////////////////////////////

	name: string;

	testRunableAsync: (
		assert: (isTure: boolean) => any,
		assertFalse: (isTure: boolean) => any)
		=> Promise<unknown>;


	////////////////////////////////////////////////
	// @类方法
	////////////////////////////////////////////////

	/**
	 * 断言指定的测试结果为“true”。
	 * @param isTure 指定的测试结果。
	 */
	static assertTrue(isTure: boolean)
	{
		if (isTure != true)
		{
			let assertFailedInfo = "验证失败：";
			{
				let error = new AssertFailedError();

				assertFailedInfo += error.stack;
			}
			throw assertFailedInfo;
		}
	}

	/**
	 * 断言指定的测试结果为“false”。
	 * @param isFalse 指定的测试结果。
	 */
	static assertFalse(isFalse: boolean)
	{
		TestCaseAsync.assertTrue(!isFalse)
	}

	/**
	 * 断言指定的测试结果为“true”。
	 * @param isTure 指定的测试结果。
	 */
	static assert(isTure: boolean): any
	{
		TestCaseAsync.assertTrue(isTure)
	}


	////////////////////////////////////////////////
	// @自身实现
	////////////////////////////////////////////////

	/**
	 * 构建测试用例基本信息。
	 * @param name 当前测试用例的名称。
	 * @param runable 当前测试用例的测试内容。
	 */
	constructor(
		name: string,
		testRunableAsync: (
			assert: (isTure: boolean) => any,
			assertFalse: (isTure: boolean) => any)
			=> Promise<unknown>)
	{
		this.name = name;
		this.testRunableAsync = testRunableAsync;
	}

	pretest()
	{
		this.didPretest();
	}

	async testAsync(): Promise<unknown>
	{
		let promise: Promise<unknown> | null = null;
		{
			// !!!
			promise = this.testRunableAsync(TestCaseAsync.assert, TestCaseAsync.assertFalse);
			// !!!
		}
		return promise;
	}

	tested()
	{
		this.didTested();
	}

	////////////////////////////////////////////////
	// @事件节点
	////////////////////////////////////////////////
	
	protected didPretest()
	{}

	protected didTested()
	{}
}