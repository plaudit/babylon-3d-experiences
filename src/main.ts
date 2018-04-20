function hello(compiler: string) {
    let name = "sasdf";
    name = "ASdf" + "asdf";
    console.log(`Hello from ${compiler} ${name}`);
}
class Test {
    private name: string;
    constructor() {
        this.name = 'asdf';
    }
}

hello("TypeScript!");
console.log('asfd');

var test = new Test();
