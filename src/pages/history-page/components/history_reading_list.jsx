import React, { useEffect, useState } from 'react';
import { TableRow, TableCell } from '@mui/material';

import CenteredSpinner from '../../../components/centered_spinner';
import NovelSourceManager from '../../../data-manager/novel_source_manager';

const ReadItems = ({ search_value }) => {
    const [novels, setNovels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [source_data, setSourceData] = useState([]);

    let novel_source_manager = NovelSourceManager.getInstance();

    useEffect(() => {
        novel_source_manager.get().then(res => {
            setSourceData([...res]);
        });
    }, []);
    useEffect(() => {
        setLoading(true); // Set loading to true when searchValue changes

        const stored_items = JSON.parse(localStorage.getItem('readItems')) || {};
        const novel_ids = Object.keys(stored_items);

        const fetchNovelData = async () => {
            const novel_data_array = await Promise.all(
                novel_ids.map(async (novel_id) => {
                    const {novelImage ,novelTitle, sourceSlug, novelStatus,chapterId,  chapterTitle} = stored_items[novel_id]; 

                    console.log(stored_items[novel_id])
                    // const novel = await GetNovelByIdService(novelId, sourceData);

                    const source = source_data.find((value) => value.slug === sourceSlug);
                    // const chapter = await GetChapterOfNovelContent(novelId, chapterId, sourceSlug);
                    return { novel_id, novelImage, novelTitle, source,novelStatus, chapterId,  chapterTitle };
                })
            );

            // Sort novels based on searchValue
            let sorted_novels = [...novel_data_array];
            switch (search_value) {
                case 1:
                    sorted_novels.reverse();
                    break;
                case 3:
                    sorted_novels.sort((a, b) => a.novelTitle.localeCompare(b.novelTitle));
                    break;
                case 4:
                    sorted_novels.sort((a, b) => b.novelTitle.localeCompare(a.novelTitle));
                    break;
                default:
                    break;
            }
            setNovels(sorted_novels);
            setLoading(false);
        };

        if (source_data.length > 0) {
            fetchNovelData();
        } else {
            setLoading(false);
        }
    }, [search_value, source_data]);

    if (loading) {
        return <CenteredSpinner />;
    }

    return (
        <>
            {novels.map(({ novel_id, novelImage, novelTitle, source,novelStatus, chapterId,  chapterTitle }, index) => (
                <TableRow key={index}>
                    <TableCell><img style={{ width: '100px', height: '150px' }} src={novelImage} alt={novelTitle} /></TableCell>
                    <TableCell style={{ color: '#fff' }}>{novelTitle}</TableCell>
                    <TableCell>{source.name}</TableCell>
                    <TableCell>{novelStatus}</TableCell>
                    <TableCell><a style={{ color: '#fff' }} href={`description/${novel_id}/chapter/${chapterId}?source=${source.slug}`}>{chapterTitle}</a></TableCell>
                </TableRow>
            )
        )}
        </>
    );
};

export default ReadItems;
