import { Bench } from 'tinybench';
import { tasks } from './tasks/index.js';
import { printReport, readReport, updateReport, writeReport } from './report.js';
import { VERSION } from '@gltf-transform/core';

/**
 * DEVELOPER NOTES:
 *
 * Started out with benchmark.js, but quickly hit some frustrating issues.
 * Async is difficult. Setup functions are serialized and can't access scope.
 * Options on the Suite appear to do nothing. Switched to tinybench.
 */

const argv = process.argv;

const parseFlag = (flag: string, value: string): string => {
	if (!value || value.startsWith('-')) {
		throw new Error(`Usage: ${flag} <value>`);
	}
	return value;
};

const flags = {
	filter: argv.includes('--filter') ? parseFlag('--filter', argv[argv.indexOf('--filter') + 1]) : false,
	past: argv.includes('--past'),
	table: argv.includes('--table'),
	report: argv.includes('--report') ? parseFlag('--report', argv[argv.indexOf('--report') + 1]) : false,
	reportVersion: argv.includes('--report-version'),
	print: argv.includes('--print'),
	help: argv.includes('--help') || argv.includes('-h'),
};

if (flags.help) {
	console.log(
		`
Usage: yarn bench [options]

Execution:
	--filter <pattern>: runs only benchmarks matching <pattern>
	--past: skip running benchmarks, show historical output only

Display:
	--print: show historical results for all benchmarks
	--table: show detailed report for current benchmark run only

History:
	--report <version>: append run to history as <version>, default to 'dev'
	--report-version: append run to history as current npm version

Miscellaneous:
	--help, -h: display help and exit
		`.trim(),
	);
	process.exit(0);
}

/******************************************************************************
 * CREATE BENCHMARK SUITE
 */

const bench = new Bench({ time: 1000 });
for (const [title, fn, options] of tasks) {
	if (!flags.filter || title.startsWith(flags.filter as string)) {
		bench.add(title, fn, options);
	}
}

/******************************************************************************
 * EXECUTE
 */

const version = flags.reportVersion ? VERSION : flags.report || 'dev';
const report = await readReport();

if (flags.past === false) {
	await bench.run();
	await updateReport(report, bench, version as string);
}

/******************************************************************************
 * REPORT
 */

if (flags.table && flags.past === false) {
	console.table(bench.table());
} else if (flags.table) {
	console.warn('Skipping table, bench did not run');
}

if (flags.print) {
	await printReport(report);
}

if (flags.report || flags.reportVersion) {
	await writeReport(report);
}
