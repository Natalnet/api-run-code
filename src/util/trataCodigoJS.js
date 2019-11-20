module.exports = (codigo,inputs_testes)=>{
	let vetor_teste = inputs_testes.split('\n').slice(0,-1)
	// converte todos valores para string
	vetor_teste = vetor_teste.map(val => `'${val}'`)
	// verifica quais valores podem ser convertidos para float
	//vetor_teste = vetor_teste.map(val => !isNaN(val)?parseFloat(val):val)
	console.log('-----vetor de testes que a função recebe---')
	console.log(vetor_teste)
	console.log('-------------------------------------------');
	vetor_teste = `[${vetor_teste.toString()}]`
	const s = ''+
	`let VETOR_TESTES = ${vetor_teste}\n`+
	"let INDECE_VETOR = 0\n"+
	"const prompt = () => {\n"+
		"let res = VETOR_TESTES[INDECE_VETOR]\n"+
		"INDECE_VETOR++\n"+
		"return res\n"+
	"}\n"+
	"const alert = (value) =>{\n"+
		"console.log(value.toString())\n"+
	"}\n"+
	codigo;
	//console.log(s);
	return s
}