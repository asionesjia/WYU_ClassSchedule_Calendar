
import React, {ChangeEvent, Dispatch, Fragment, SetStateAction, useEffect, useState} from 'react';
import {stringHtmlToDocumentObj} from "@/app/utils/stringHtmlToDocumentObj";
import {tableToJson} from "@/app/utils/tableElementToJson";
import {ClassScheduleMetadata} from "@/app/page";
import {Course} from "@/app/utils/classScheduleHandle";
import {DialogModal} from "@/app/components/dialogModal";
import {ClassScheduleTable} from "@/app/components/classScheduleTable";
import {toast} from "react-toastify";
import {allowedDisplayValues} from "next/dist/compiled/@next/font/dist/constants";



interface HandleLocalClassScheduleFileProps {
    classScheduleMetadata: ClassScheduleMetadata | undefined;
    setClassScheduleMetadata: Dispatch<SetStateAction<ClassScheduleMetadata | undefined>>;
}

const HandleLocalClassScheduleFile: React.FC<HandleLocalClassScheduleFileProps> = ({classScheduleMetadata, setClassScheduleMetadata}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadFileName, setUploadFileName] = useState<string>('');
    const [uploadFileStringHtml, setUploadFileStringHtml] = useState<string>('');
    const [uploadFileDocument, setUploadFileDocument] = useState<Document | undefined>(undefined);
    const [isOpen, setOpen] = useState(false)
    const [isUploadConfirmed, setUploadConfirmed] = useState(false)
    const [isPreviewed, setPreviewed] = useState(false)
    const [inputNameValue, setInputNameValue] = useState<string>('');
    const [inputDescriptionValue, setInputDescriptionValue] = useState<string>('');


    useEffect(() => {
        if(uploadFileStringHtml) {
            const document = stringHtmlToDocumentObj(uploadFileStringHtml)
            setUploadFileDocument(document)
            setOpen(true)
        }
        cleanState()
    }, [uploadFileStringHtml]);

    useEffect(() => {
        if(isUploadConfirmed && uploadFileDocument) {
            const classScheduleName = uploadFileDocument?.getElementsByTagName('strong')[0].outerText.split(' ')[0]
            const classScheduleTable = uploadFileDocument?.getElementById('kbtable0') as HTMLTableElement
            if(classScheduleTable) {
                const toastUpload = toast('正在上传中...', {
                    isLoading: true,
                    autoClose: false,
                })
                const classScheduleData = classScheduleTable.outerHTML
                const upload = fetch('/api/classSchedules', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: inputNameValue,
                        description: inputDescriptionValue,
                        stringTable: classScheduleData
                    }),
                }).then((res) => res.json())

                const uploadRes = upload
                    .then((data) => {
                        if(data?.error){
                            cancelPreviewModal()
                            toast.update(toastUpload, {
                                isLoading: false,
                                type: "error",
                                autoClose: 5000,
                                render: `上传失败：${data.error}`
                            })
                        }else {
                            setClassScheduleMetadata({
                                name: data.data['name'],
                                description: data.data['description'],
                                uuid: data.data['uuid'],
                                createAt: data.data['createAt'],
                                stringTable: data.data['stringTable']
                            })
                            toast.update(toastUpload, {
                                isLoading: false,
                                type: "success",
                                autoClose: 5000,
                                render: `上传成功：${data.data.name}`
                            })
                        }
                    })
            }
        }
    }, [isUploadConfirmed]);

    const handleInputNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputNameValue(e.target.value);
    };
    const handleInputDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputDescriptionValue(e.target.value);
    };

    const cleanState = () => {
        setInputNameValue('');
        setInputDescriptionValue('')
    };

    const confirmPreviewModal = () => {
        setPreviewed(true)
    }

    const confirmUpload = () => {
        setUploadConfirmed(true)
        setOpen(false)
    }

    const cancelPreviewModal = () => {
        setOpen(false)
        setClassScheduleMetadata(undefined)
        setUploadFileName('')
        setUploadFileStringHtml('')
        setInputNameValue('')
        setUploadConfirmed(false)
        setTimeout(() => setPreviewed(false), 1000);
    }

    const handleDragEnter = () => {setIsDragging(true);};
    const handleDragLeave = () => {setIsDragging(false);};
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);

        const files = event.dataTransfer.files;

        // 检查文件类型
        if (files.length > 0 && files[0].type === 'application/vnd.ms-excel') {
            console.log('拖动的XLS文件:', files[0]);
            setUploadFileName(files[0].name)
            // 处理上传逻辑，可以调用上传函数
        } else {
            console.log('文件类型错误，请上传XLS文件。');
        }
    };
    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        // 检查文件类型
        if (files && files.length > 0 && files[0].type === 'application/vnd.ms-excel') {
            console.log('选择的XLS文件:', files[0]);
            setUploadFileName(files[0].name)
            readExcelFile(files[0])
            // 处理上传逻辑，可以调用上传函数
        } else {
            console.log('文件类型错误，请上传XLS文件。');
        }
    };
    const readExcelFile = (selectedFile: File) => {
        if (selectedFile) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const arrayBuffer = e.target?.result as ArrayBuffer;
                const uint8Array = new Uint8Array(arrayBuffer);
                const textDecoder = new TextDecoder('utf-8');
                const decodedString = textDecoder.decode(uint8Array);
                setUploadFileStringHtml(decodedString)
            };

            reader.readAsArrayBuffer(selectedFile);
        }
    };

    return (
        <div>
            <DialogModal isOpen={isOpen} setIsOpen={setOpen} confirmCallback={isPreviewed ? confirmUpload : confirmPreviewModal} cancelCallback={cancelPreviewModal}>
                {isPreviewed ?
                    <div className="flex flex-col items-start">
                        <p className={'text-gray-400'}>因为您是该课程表的上传者，请您为它进行命名和描述。</p>
                        <div className={'w-full pt-6 space-y-6 text-gray-400'}>
                            <div>
                                <p className={'text-black'}>课程表名称：</p>
                                <p className={'pb-2'}>建议命名规范：学期 + 学院 + 年级 + 专业 + 班级</p>
                                <input
                                    type="text"
                                    className="w-2/3 border-2 focus:border-red-600 px-4 py-2 rounded-md outline-none focus:outline-none"
                                    placeholder="如:23年下生21环生"
                                    value={inputNameValue}
                                    onChange={handleInputNameChange}
                                />
                            </div>
                            <div>
                                <p className={'text-black'}>课程表描述：</p>
                                <input
                                    type="text"
                                    className="w-2/3 border-2 focus:border-red-600 px-4 py-2 rounded-md outline-none focus:outline-none"
                                    placeholder="如：春风又绿江南岸，安安安。"
                                    value={inputDescriptionValue}
                                    onChange={handleInputDescriptionChange}
                                />
                            </div>
                        </div>
                    </div>
                    :
                    <div
                        dangerouslySetInnerHTML={{__html: uploadFileDocument?.getElementById('kbtable0')?.outerHTML || ''}}/>
                }
            </DialogModal>
            <div
                className={`rounded-xl ${
                    isDragging ? 'bg-gray-100 shadow-2xl' : 'border-2 border-dashed border-gray-400 '
                }`}
                onDragEnter={handleDragEnter}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="p-8 text-center">
                    <p className="text-gray-400 font-semibold mb-1">拖拽 班级课表.xls 文件到此处</p>
                    <p className="text-gray-400">或者点击
                        <label className="cursor-pointer text-red-500">
                            <input
                                id={'file_input'}
                                type="file"
                                className="hidden"
                                onChange={handleFileInputChange}
                                accept=".xls"
                            />
                            选择文件
                        </label>
                    </p>
                </div>
            </div>
            {uploadFileName &&
            <div className={'flex w-full pt-6 items-end justify-between'}>
                <div className={'w-2/3 rounded-xl text-gray-400'}>{uploadFileName}</div>
                <div className={'px-6 py-3 bg-gray-900/20 dark:bg-gray-500/60 text-sm text-white font-bold rounded-xl hover:bg-red-500 hover:border-0 hover:text-white cursor-pointer'}>确定</div>
            </div>}
        </div>
    );
};

export default HandleLocalClassScheduleFile;
