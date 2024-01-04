/**
 * Copies ffmpeg and ffprobe to the ab-av1 directory and then executes the ab-av1 command.
 * @author Devedse
 * @revision 2
 * @minimumVersion 1.0.0.0
 * @output The command succeeded
 * @output Variables.AbAv1CRFValue: The detected CRF value
 */
function Script()
{
    let preset = '4';
    let targetDirectory = '/app/Data/tools/ab-av1/';

    let ffmpegBtbnDirectory = Variables.FfmpegBtbn;
    if(!ffmpegBtbnDirectory){
        Logger.ELog('Variables.FfmpegBtbn was not set. Ensure the InstallFfmpegBtbN script was run before this script.');
        return -1;
    }
    Logger.ILog('FfmpegBtbn directory: ' + ffmpegBtbnDirectory);

    // Get the input file path from Flow.WorkingFile
    var fi = FileInfo(Flow.WorkingFile);

    // Check if ab-av1 exists
    let abAv1Path = targetDirectory + 'ab-av1';
    let checkAbAv1 = Flow.Execute({
        command: 'ls',
        argumentList: [abAv1Path]
    });
    if(checkAbAv1.exitCode !== 0){
        Logger.ELog('ab-av1 not found at ' + abAv1Path);
        return -1;
    }

    // Execute ab-av1 with specified parameters
    // let executeAbAv1 = Flow.Execute({
    //     command: abAv1Path,
    //     argumentList: [
    //         'crf-search',
    //         '--svt',
    //         'enable-qm=1:qm-min=4:qm-max=9',
    //         '--pix-format',
    //         'yuv420p10le',
    //         '-i',
    //         fi.FullName, // Use the full path of the input file
    //         '--preset',
    //         preset
    //     ],
    //     workingDirectory: Variables.FfmpegBtbn
    // });
    let executeAbAv1 = Flow.Execute({
    command: 'sh',
    argumentList: [
            '-c',
            `PATH=${Variables.FfmpegBtbn}:$PATH ` + 
            `${abAv1Path} crf-search --svt enable-qm=1:qm-min=4:qm-max=9 ` +
            `--pix-format yuv420p10le -i '${fi.FullName}' --preset ${preset}`
        ]
    });

    if(executeAbAv1.exitCode !== 0){
        Logger.ELog('Failed to execute ab-av1: ' + executeAbAv1.exitCode);
        return -1;
    }

    Logger.ILog('ab-av1 executed successfully.');


    // Parse the output to find the CRF value
    let output = executeAbAv1.output;
    let crfValueMatch = output.match(/crf (\d+)/);
    if (crfValueMatch && crfValueMatch.length > 1) {
        let crfValue = crfValueMatch[1];
        Logger.ILog('CRF value: ' + crfValue);

        // Set the CRF value for use in another node
        Variables.AbAv1CRFValue = crfValue;
        return 1;
    } else {
        Logger.ELog('CRF value not found in output');
        return 0;
    }

    return 1;










    // let ffmpegPath = Variables.ffmpeg; // Assuming this is how you access the variable
    // let ffprobePath = Variables.ffprobe; // Assuming this is how you access the variable
    // let preset = '4';

    // //Fix issue where ffprobe is not in /usr/local/bin/ffprobe
    // let copyFfprobeFirst = Flow.Execute({
    //     command: 'cp',
    //     argumentList: ['/usr/lib/jellyfin-ffmpeg/ffprobe', ffprobePath]
    // });
    // if(copyFfprobeFirst.exitCode !== 0){
    //     Logger.ELog('Failed to copy ffprobe from /usr/lib/jellyfin-ffmpeg/ffprobe to ' + ffprobePath);
    //     return -1;
    // }




    // Get the input file path from Flow.WorkingFile
    var fi = FileInfo(Flow.WorkingFile);

    // // Copy ffmpeg and ffprobe to the target directory
    // let copyFfmpeg = Flow.Execute({
    //     command: 'cp',
    //     argumentList: [ffmpegPath, targetDirectory]
    // });
    // if(copyFfmpeg.exitCode !== 0){
    //     Logger.ELog('Failed to copy ffmpeg to ' + targetDirectory);
    //     return -1;
    // }

    // let copyFfprobe = Flow.Execute({
    //     command: 'cp',
    //     argumentList: [ffprobePath, targetDirectory]
    // });
    // if(copyFfprobe.exitCode !== 0){
    //     Logger.ELog('Failed to copy ffprobe to ' + targetDirectory);
    //     return -1;
    // }

    return -1;

    // Check if ab-av1 exists
    let abAv1Path = targetDirectory + 'ab-av1';
    let checkAbAv1 = Flow.Execute({
        command: 'ls',
        argumentList: [abAv1Path]
    });
    if(checkAbAv1.exitCode !== 0){
        Logger.ELog('ab-av1 not found at ' + abAv1Path);
        return -1;
    }

    // Execute ab-av1 with specified parameters
    let executeAbAv1 = Flow.Execute({
        command: abAv1Path,
        argumentList: [
            'crf-search',
            '--svt',
            'enable-qm=1:qm-min=4:qm-max=9',
            '--pix-format',
            'yuv420p10le',
            '-i',
            fi.FullName, // Use the full path of the input file
            '--preset',
            preset
        ]
    });

    if(executeAbAv1.exitCode !== 0){
        Logger.ELog('Failed to execute ab-av1: ' + executeAbAv1.exitCode);
        return -1;
    }

    Logger.ILog('ab-av1 executed successfully.');


    // Parse the output to find the CRF value
    let output = executeAbAv1.output;
    let crfValueMatch = output.match(/crf (\d+)/);
    if (crfValueMatch && crfValueMatch.length > 1) {
        let crfValue = crfValueMatch[1];
        Logger.ILog('CRF value: ' + crfValue);

        // Set the CRF value for use in another node
        Variables.AbAv1CRFValue = crfValue;
        return 1;
    } else {
        Logger.ELog('CRF value not found in output');
        return 0;
    }

    return 1;
}