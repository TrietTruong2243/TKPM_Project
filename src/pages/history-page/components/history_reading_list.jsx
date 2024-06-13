import React, { useEffect, useState } from 'react';
import { TableRow, TableCell } from '@mui/material';

import CenteredSpinner from '../../../components/centered_spinner';
import NovelSourceManager from '../../../data-manager/novel_source_manager';
import { useNavigate } from 'react-router-dom';

const ReadItems = ({ search_value }) => {
    const [novels, setNovels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [source_data, setSourceData] = useState([]);
    const navigate = useNavigate();
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
                novel_ids.map(async (novelId) => {
                    const { novelImage, novelTitle, sourceSlug, novelStatus, chapterId, chapterTitle, chapterPosition } = stored_items[novelId];
                    const source = source_data.find((value) => value.slug === sourceSlug);
                    return { novelId, novelImage, novelTitle, source, novelStatus, chapterId, chapterTitle, chapterPosition };
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

    const handleChapterClick = (novelId, chapterId, chapterPosition, sourceSlug) => {
        navigate(`/description/${novelId}/chapter`, {
            state: {
                chapterSlug: chapterId,
                chapterPosition: chapterPosition,
                sourceSlug: sourceSlug,
            },
        });
    };

    return (
        <>
            {novels.map(({ novelId, novelImage, novelTitle, source, novelStatus, chapterId, chapterTitle, chapterPosition }, index) => (
                <TableRow key={index}>
                    <TableCell><img style={{ width: '100px', height: '150px' }} src={novelImage} alt={novelTitle} /></TableCell>
                    <TableCell style={{ color: '#fff' }}>{novelTitle}</TableCell>
                    <TableCell>{source.name}</TableCell>
                    <TableCell>{novelStatus}</TableCell>
                    <TableCell>
                        <div
                            onClick={() => handleChapterClick(novelId, chapterId, chapterPosition, source.slug)}
                            style={{ color: '#fff', cursor: 'pointer' }}
                        >
                            {chapterTitle}
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
};

export default ReadItems;
