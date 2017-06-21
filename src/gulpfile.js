// Aqui nós carregamos o gulp e os plugins através da função `require` do nodejs
var gulp      = require('gulp');
var jshint    = require('gulp-jshint');
var uglify    = require('gulp-uglify');
var concat    = require('gulp-concat');
var cssimport = require('gulp-cssimport');
var csslint   = require('gulp-csslint');
var cleanCSS = require('gulp-clean-css');
var rename    = require('gulp-rename');
var del       = require('del');

// Definimos o diretorio dos arquivos para evitar repetição futuramente
// -- arquivos não minificados
var paths = {
	scripts : [
		'./public/assets/js/original/*.js',
		//'!./public/assets/js/original/notifications.js'
	],
	styles  : [
		'./public/assets/css/default/*.css',
		'./public/assets/css/original/*.css'
	]
};

//Criamos outra tarefa com o nome 'build'
gulp.task('build-js', function() {

	// Carregamos os arquivos novamente
	// E rodamos uma tarefa para concatenação
	// Renomeamos o arquivo que sera minificado e logo depois o minificamos com o `uglify`
	// E pra terminar usamos o `gulp.dest` para colocar os arquivos concatenados e minificados na pasta build/
	return gulp.src(paths.scripts)
		//.pipe(concat('./build/js'))
		.pipe(jshint())
		.pipe(jshint.reporter())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(uglify())
		.pipe(gulp.dest('./public/assets/js/'));
});

gulp.task('build-css', function() {

	return gulp.src(['./public/assets/css/style.css','./public/assets/css/default.css'])
		.pipe(cssimport())
		//.pipe(csslint())
		.pipe(csslint.formatter())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
		.pipe(gulp.dest('./public/assets/css/'))
});


// tarefa padrão
gulp.task('watch', function(){
	gulp.watch(paths.scripts, ['build-js']);
	gulp.watch(paths.styles, ['build-css']);
});


//Criamos uma tarefa 'default' que vai rodar quando rodamos `gulp` no projeto
gulp.task('default', ['watch','build-js','build-css']);
