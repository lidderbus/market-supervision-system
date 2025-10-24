import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../Card';

describe('Card 组件', () => {
  describe('Card 主组件', () => {
    it('应渲染子元素', () => {
      render(<Card>Test Content</Card>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('应应用自定义 className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>);
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('应包含基础样式类', () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.firstChild).toHaveClass('bg-white', 'rounded-lg', 'shadow-md');
    });

    it('hoverable=true 应添加 hover 样式', () => {
      const { container } = render(<Card hoverable>Content</Card>);
      expect(container.firstChild).toHaveClass('hover:shadow-lg');
    });

    it('应正确应用 padding=sm', () => {
      const { container } = render(<Card padding="sm">SM</Card>);
      expect(container.firstChild).toHaveClass('p-3');
    });

    it('应正确应用 padding=md (默认)', () => {
      const { container } = render(<Card padding="md">MD</Card>);
      expect(container.firstChild).toHaveClass('p-4');
    });

    it('应正确应用 padding=lg', () => {
      const { container } = render(<Card padding="lg">LG</Card>);
      expect(container.firstChild).toHaveClass('p-6');
    });

    it('应正确应用 padding=none', () => {
      const { container } = render(<Card padding="none">NONE</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).not.toMatch(/p-\d+/);
    });

    it('点击时应触发 onClick 回调', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Card onClick={handleClick}>Clickable</Card>);

      await user.click(screen.getByText('Clickable'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('onClick 存在时应添加 cursor-pointer', () => {
      const { container } = render(<Card onClick={() => {}}>Content</Card>);
      expect(container.firstChild).toHaveClass('cursor-pointer');
    });

    it('应支持自定义 style', () => {
      const customStyle = { backgroundColor: 'red' };
      const { container } = render(<Card style={customStyle}>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.style.backgroundColor).toBe('red');
    });
  });

  describe('CardHeader', () => {
    it('应渲染子元素', () => {
      render(<CardHeader>Header</CardHeader>);
      expect(screen.getByText('Header')).toBeInTheDocument();
    });

    it('应应用 mb-4 类', () => {
      const { container } = render(<CardHeader>Header</CardHeader>);
      expect(container.firstChild).toHaveClass('mb-4');
    });

    it('应支持自定义 className', () => {
      const { container } = render(<CardHeader className="custom">Header</CardHeader>);
      expect(container.firstChild).toHaveClass('custom', 'mb-4');
    });
  });

  describe('CardTitle', () => {
    it('应渲染 h3 标签', () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByText('Title');
      expect(title.tagName).toBe('H3');
    });

    it('应应用正确的样式类', () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByText('Title');
      expect(title).toHaveClass('text-lg', 'font-semibold', 'text-gray-900');
    });

    it('应支持自定义 className', () => {
      render(<CardTitle className="custom">Title</CardTitle>);
      const title = screen.getByText('Title');
      expect(title).toHaveClass('custom', 'text-lg');
    });
  });

  describe('CardContent', () => {
    it('应渲染内容', () => {
      render(<CardContent>Content Text</CardContent>);
      expect(screen.getByText('Content Text')).toBeInTheDocument();
    });

    it('应应用 text-gray-700', () => {
      const { container } = render(<CardContent>Content</CardContent>);
      expect(container.firstChild).toHaveClass('text-gray-700');
    });

    it('应支持自定义 className', () => {
      const { container } = render(<CardContent className="custom">Content</CardContent>);
      expect(container.firstChild).toHaveClass('custom', 'text-gray-700');
    });
  });

  describe('CardFooter', () => {
    it('应渲染子元素', () => {
      render(<CardFooter>Footer</CardFooter>);
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('应显示顶部边框', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>);
      expect(container.firstChild).toHaveClass('border-t', 'border-gray-200');
    });

    it('应应用 mt-4 和 pt-4', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>);
      expect(container.firstChild).toHaveClass('mt-4', 'pt-4');
    });

    it('应支持自定义 className', () => {
      const { container } = render(<CardFooter className="custom">Footer</CardFooter>);
      expect(container.firstChild).toHaveClass('custom', 'mt-4');
    });
  });

  describe('复合组件', () => {
    it('应正确渲染完整卡片', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>卡片标题</CardTitle>
          </CardHeader>
          <CardContent>卡片内容</CardContent>
          <CardFooter>卡片底部</CardFooter>
        </Card>
      );

      expect(screen.getByText('卡片标题')).toBeInTheDocument();
      expect(screen.getByText('卡片内容')).toBeInTheDocument();
      expect(screen.getByText('卡片底部')).toBeInTheDocument();
    });

    it('应支持嵌套结构', () => {
      render(
        <Card hoverable padding="lg" onClick={() => {}}>
          <CardHeader>
            <CardTitle>标题</CardTitle>
          </CardHeader>
          <CardContent>
            <p>段落1</p>
            <p>段落2</p>
          </CardContent>
        </Card>
      );

      expect(screen.getByText('标题')).toBeInTheDocument();
      expect(screen.getByText('段落1')).toBeInTheDocument();
      expect(screen.getByText('段落2')).toBeInTheDocument();
    });
  });
});
