import { ChangeCodeMirrorLanguage, codeBlockPlugin, codeMirrorPlugin, ConditionalContents, diffSourcePlugin, DiffSourceToggleWrapper, headingsPlugin, InsertCodeBlock, markdownShortcutPlugin, UndoRedo, MDXEditor, toolbarPlugin, BoldItalicUnderlineToggles, listsPlugin, linkPlugin, quotePlugin } from '@mdxeditor/editor';
import { Card } from "@prisma/client";
import '@mdxeditor/editor/style.css';
import "~/styles/prose.css";
import { useCallback, useState } from 'react';
import { updateCardFn } from '~/lib/services/cards';
import { useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


export default function CardDescription({ card }: { card: Card }) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(card.description ?? "");
  const router = useRouter();

  const persistDescription = useCallback(async () => {
    console.log("persistDescription", description);
    await updateCardFn({
      data: {
        ...card,
        description: description
      }
    });
    router.invalidate();
    toast.success("Description updated");
    setIsEditing(false);
  }, [card.id, description, router]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setDescription(card.description ?? "");
  }, [card.description]);

  if (!isEditing && !description) {
    return (
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Description</h3>
        <div className="flex flex-col gap-2 bg-gray-100 rounded-md p-2 min-h-[100px] cursor-pointer hover:bg-gray-200" onClick={() => setIsEditing(true)}>
          Add a more detailed description
        </div>
      </ div >
    );
  }

  if (!isEditing && description) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <h3 className="text-lg font-bold">Description</h3>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md ml-auto" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        </div>
        <div className=" p-2 min-h-[200px] prose">
          <Markdown remarkPlugins={[remarkGfm]}>{card.description}</Markdown>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-bold">Description</h3>
      <div className="border border-gray-200 rounded-md p-2 min-h-[200px]">
        <MDXEditor
          placeholder="Add a more detailed description"
          contentEditableClassName="prose"
          markdown={description}
          onChange={(markdown) => setDescription(markdown)}
          plugins={[
            listsPlugin(), linkPlugin(), quotePlugin(),
            headingsPlugin({
              allowedHeadingLevels: [1, 2, 3, 4]
            }),
            codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
            codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS' } }),
            diffSourcePlugin({ diffMarkdown: card.description ?? "", viewMode: 'source' }),
            toolbarPlugin({
              toolbarContents: () => (
                <>
                  <DiffSourceToggleWrapper>
                    <UndoRedo />
                    <BoldItalicUnderlineToggles />
                    <ConditionalContents
                      options={[
                        { when: (editor) => editor?.editorType === 'codeblock', contents: () => <ChangeCodeMirrorLanguage /> },
                        {
                          fallback: () => (<>
                            <InsertCodeBlock />
                          </>)
                        }
                      ]}
                    />
                  </DiffSourceToggleWrapper>
                </>
              )
            }),
            markdownShortcutPlugin({
              markdownShortcuts: [
                {
                  markdownShortcut: '**',
                  markdown: '**',
                  markdownReplacement: '**',
                  markdownReplacementType: 'bold'
                }
              ]
            }),
          ]}
        />
      </div>
      <div className="flex gap-2">
        <button className="bg-cyan-700 text-white px-4 py-2 rounded-md" onClick={persistDescription}>
          Save
        </button>
        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md" onClick={cancelEdit}>
          Cancel
        </button>
      </div>
    </div>
  );
}
