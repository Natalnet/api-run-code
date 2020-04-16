module.exports = (codigo, inputs_testes)=>{

	let vetor_teste = inputs_testes.split('\n');
	vetor_teste = vetor_teste.filter(teste=> teste !== "")
	// converte todos valores para string
	vetor_teste = vetor_teste.map(val => `'${val}'`)
	// verifica quais valores podem ser convertidos para float
	//vetor_teste = vetor_teste.map(val => !isNaN(val)?parseFloat(val):val)
	vetor_teste = `[${vetor_teste.toString()}]`
	const s = ''+
	`let VETOR_TESTES = ${vetor_teste}\n`+
	"let INDECE_VETOR = 0\n"+
	"function prompt(value){\n"+
		"let res = VETOR_TESTES[INDECE_VETOR]\n"+
		"INDECE_VETOR++\n"+
		"return res\n"+
	"}\n"+
	"const alert = (value='') =>{\n"+
		"process.stdout.write(value.toString())\n"+
	"}\n"+
	codigo;
	return s
}