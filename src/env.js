const path = require('path')

module.exports = {
	//URL_GCC : process.env.URL_GCC || path.normalize('C:/Program Files (x86)/CodeBlocks/MinGW/bin/gcc.exe')
	URL_JAVAC : process.env.URL_JAVAC || '/usr/bin/javac', 
	URL_JAVA : process.env.URL_JAVA || '/usr/bin/java', 
	URL_GPP : process.env.URL_GPP || '/usr/bin/g++',
	URL_GCC : process.env.URL_GCC || '/usr/bin/gcc',
	URL_PYTHON : process.env.URL_PYTHON,
	STDERR_LIMIT : process.env.STDERR_LIMIT || 2000,
	STDOUT_LIMIT : process.env.STDOUT_LIMIT || 2000
}
