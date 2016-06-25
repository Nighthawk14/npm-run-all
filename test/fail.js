/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("power-assert")
const {removeResult} = require("./lib/util")

// Test targets.
const nodeApi = require("../src/lib")
const runAll = require("../src/bin/npm-run-all")
const runSeq = require("../src/bin/run-s")
const runPar = require("../src/bin/run-p")

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Throws an assertion error if a given promise comes to be fulfilled.
 *
 * @param {Promise} p - A promise to check.
 * @returns {Promise} A promise which is checked.
 */
function shouldFail(p) {
    return p.then(
        () => assert(false, "should fail"),
        () => null // OK!
    )
}

//------------------------------------------------------------------------------
// Test
//------------------------------------------------------------------------------

describe("[fail] it should fail", () => {
    before(() => process.chdir("test-workspace"))
    after(() => process.chdir(".."))

    beforeEach(removeResult)

    describe("if an invalid option exists.", () => {
        it("npm-run-all command", () => shouldFail(runAll(["--invalid"])))
        it("run-s command", () => shouldFail(runSeq(["--parallel"])))
        it("run-p command", () => shouldFail(runPar(["--sequential"])))
    })

    describe("if invalid `options.taskList` is given.", () => {
        it("Node API", () => shouldFail(nodeApi("test-task:append a", {taskList: {invalid: 0}})))
    })

    describe("if unknown tasks are given:", () => {
        it("Node API", () => shouldFail(nodeApi("unknown-task")))
        it("npm-run-all command", () => shouldFail(runAll(["unknown-task"])))
        it("run-s command", () => shouldFail(runSeq(["unknown-task"])))
        it("run-p command", () => shouldFail(runPar(["unknown-task"])))
    })

    describe("if unknown tasks are given (2):", () => {
        it("Node API", () => shouldFail(nodeApi(["test-task:append:a", "unknown-task"])))
        it("npm-run-all command", () => shouldFail(runAll(["test-task:append:a", "unknown-task"])))
        it("run-s command", () => shouldFail(runSeq(["test-task:append:a", "unknown-task"])))
        it("run-p command", () => shouldFail(runPar(["test-task:append:a", "unknown-task"])))
    })

    describe("if package.json is not found:", () => {
        before(() => process.chdir("no-package-json"))
        after(() => process.chdir(".."))

        it("Node API", () => shouldFail(nodeApi(["test-task:append:a"])))
        it("npm-run-all command", () => shouldFail(runAll(["test-task:append:a"])))
        it("run-s command", () => shouldFail(runSeq(["test-task:append:a"])))
        it("run-p command", () => shouldFail(runPar(["test-task:append:a"])))
    })

    describe("if package.json does not have scripts field:", () => {
        before(() => process.chdir("no-scripts"))
        after(() => process.chdir(".."))

        it("Node API", () => shouldFail(nodeApi(["test-task:append:a"])))
        it("npm-run-all command", () => shouldFail(runAll(["test-task:append:a"])))
        it("run-s command", () => shouldFail(runSeq(["test-task:append:a"])))
        it("run-p command", () => shouldFail(runPar(["test-task:append:a"])))
    })

    describe("if tasks exited with non-zero code:", () => {
        it("Node API", () => shouldFail(nodeApi("test-task:error")))
        it("npm-run-all command", () => shouldFail(runAll(["test-task:error"])))
        it("run-s command", () => shouldFail(runSeq(["test-task:error"])))
        it("run-p command", () => shouldFail(runPar(["test-task:error"])))
    })
})
