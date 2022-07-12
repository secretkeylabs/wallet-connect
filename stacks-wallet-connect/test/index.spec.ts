import "mocha";
import { expect } from "chai";

describe("TODO", function () {
    // this.timeout(30_000);
    let g = 1;
    before(async () => {
        console.log('Before');
        g = 2;
    });
    after(async () => {
        console.log('After');
        g = 3;
    });

    it("test 1", async () => {
        console.log('Test 1');
        expect(g).to.equal(2);
    });
});