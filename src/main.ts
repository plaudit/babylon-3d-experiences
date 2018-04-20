function hello(compiler: string) {
    let name = "sasdf";
    name = "ASdf" + "asdf";
    console.log(`Hello from ${compiler} ${name}`);
}
class Test {
    private name: string;
    constructor() {
        console.log('xxx');
        this.name = 'asdf';
    }
}

hello("TypeScript!");

var test = new Test();
